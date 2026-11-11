
import { Router } from "express";
import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "../db/prisma.js";
import { requireAuth, requireApproved } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { writeAudit } from "../utils/audit.js";
import { accountSchema } from "../validators/schemas.js";

const r = Router();
r.use(requireAuth, requireApproved);

const amountSchema = z.object({
  amount: z.number().finite().positive().max(1000000)
});

function validateAmount(body) {
  const parsed = amountSchema.safeParse(body);

  if (!parsed.success) {
    return null;
  }

  const amount = parsed.data.amount;

  if (Math.round(amount * 100) !== amount * 100) {
    return null;
  }

  return new Prisma.Decimal(amount.toFixed(2));
}

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getBalance(tx, accountId) {
  const totals = await tx.ledgerEntry.groupBy({
    by: ["entryType"],
    where: { accountId },
    _sum: { amount: true }
  });

  let credits = new Prisma.Decimal(0);
  let debits = new Prisma.Decimal(0);

  for (const item of totals) {
    if (item.entryType === "CREDIT") {
      credits = item._sum.amount ?? credits;
    } else {
      debits = item._sum.amount ?? debits;
    }
  }

  return credits.minus(debits);
}

// Get accounts belonging to the logged-in user
r.get("/", asyncHandler(async (req, res) => {
  const accounts = await prisma.account.findMany({
    where: { ownerId: req.user.id },
    orderBy: { createdAt: "desc" }
  });

  res.json({ accounts });
}));

// Create an account
r.post("/", asyncHandler(async (req, res) => {
  const p = accountSchema.safeParse(req.body);

  if (!p.success) {
    return res.status(400).json({
      error: "Invalid account data",
      details: p.error.flatten()
    });
  }

  const account = await prisma.account.create({
    data: {
      ownerId: req.user.id,
      name: p.data.name,
      currency: p.data.currency.toUpperCase(),
      accountNumber: `BV-${randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase()}`
    }
  });

  await writeAudit({
    actorId: req.user.id,
    action: "ACCOUNT_CREATED",
    resourceType: "ACCOUNT",
    resourceId: account.id
  });

  res.status(201).json({ account });
}));

// Deposit (development simulation only)
r.post("/:id/deposit", asyncHandler(async (req, res) => {
  const amount = validateAmount(req.body);

  if (!amount) {
    return res.status(400).json({
      error: "Enter a positive amount with at most two decimal places"
    });
  }

  const result = await prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({
      where: { id: req.params.id, ownerId: req.user.id }
    });

    if (!account) throw httpError("Account not found", 404);
    if (account.status !== "ACTIVE") {
      throw httpError("Account is not active", 400);
    }

    const entry = await tx.ledgerEntry.create({
      data: {
        transactionRef: randomUUID(),
        accountId: account.id,
        entryType: "CREDIT",
        amount,
        currency: account.currency,
        description: "Development test deposit"
      }
    });

    return { entry };
  });

  await writeAudit({
    actorId: req.user.id,
    action: "DEPOSIT_CREATED",
    resourceType: "ACCOUNT",
    resourceId: req.params.id,
    metadata: { amount: amount.toFixed(2), currency: result.entry.currency }
  });

  res.status(201).json({
    message: "Deposit recorded successfully",
    entry: result.entry
  });
}));

// Withdraw money
r.post("/:id/withdraw", asyncHandler(async (req, res) => {
  const amount = validateAmount(req.body);

  if (!amount) {
    return res.status(400).json({
      error: "Enter a positive amount with at most two decimal places"
    });
  }

  const result = await prisma.$transaction(async (tx) => {
    // Lock this account so concurrent withdrawals cannot spend the same balance.
    const locked = await tx.$queryRaw`
      SELECT id
      FROM accounts
      WHERE id = ${req.params.id}::uuid
        AND owner_id = ${req.user.id}::uuid
      FOR UPDATE
    `;

    if (locked.length === 0) {
      throw httpError("Account not found", 404);
    }

    const account = await tx.account.findUnique({
      where: { id: req.params.id }
    });

    if (account.status !== "ACTIVE") {
      throw httpError("Account is not active", 400);
    }

    const balance = await getBalance(tx, account.id);

    if (balance.lessThan(amount)) {
      throw httpError("Insufficient balance", 400);
    }

    const entry = await tx.ledgerEntry.create({
      data: {
        transactionRef: randomUUID(),
        accountId: account.id,
        entryType: "DEBIT",
        amount,
        currency: account.currency,
        description: "Development test withdrawal"
      }
    });

    return { entry, balance: balance.minus(amount) };
  });

  await writeAudit({
    actorId: req.user.id,
    action: "WITHDRAWAL_CREATED",
    resourceType: "ACCOUNT",
    resourceId: req.params.id,
    metadata: { amount: amount.toFixed(2), currency: result.entry.currency }
  });

  res.status(201).json({
    message: "Withdrawal recorded successfully",
    entry: result.entry,
    remainingBalance: result.balance.toFixed(2)
  });
}));

// Transfer between two accounts belonging to the same user
r.post("/:id/transfer", asyncHandler(async (req, res) => {
  const schema = z.object({
    destinationAccountId: z.string().uuid(),
    amount: z.number().finite().positive().max(1000000)
  });

  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Provide a valid destination account ID and amount"
    });
  }

  const amount = validateAmount({ amount: parsed.data.amount });

  if (!amount) {
    return res.status(400).json({
      error: "Enter an amount with at most two decimal places"
    });
  }

  const sourceId = req.params.id;
  const destinationId = parsed.data.destinationAccountId;

  if (sourceId === destinationId) {
    return res.status(400).json({
      error: "Source and destination accounts must be different"
    });
  }

  const result = await prisma.$transaction(async (tx) => {
    // Lock both accounts in a consistent order to reduce deadlock risk.
    const ids = [sourceId, destinationId].sort();

    const locked = await tx.$queryRaw`
      SELECT id
      FROM accounts
      WHERE id IN (${Prisma.join(ids.map(id => Prisma.sql`${id}::uuid`))})
        AND owner_id = ${req.user.id}::uuid
      ORDER BY id
      FOR UPDATE
    `;

    if (locked.length !== 2) {
      throw httpError("One or both accounts were not found", 404);
    }

    const accounts = await tx.account.findMany({
      where: { id: { in: ids }, ownerId: req.user.id }
    });

    const source = accounts.find(a => a.id === sourceId);
    const destination = accounts.find(a => a.id === destinationId);

    if (source.status !== "ACTIVE" || destination.status !== "ACTIVE") {
      throw httpError("Both accounts must be active", 400);
    }

    if (source.currency !== destination.currency) {
      throw httpError("Account currencies must match", 400);
    }

    const balance = await getBalance(tx, source.id);

    if (balance.lessThan(amount)) {
      throw httpError("Insufficient balance", 400);
    }

    const transactionRef = randomUUID();

    const debit = await tx.ledgerEntry.create({
      data: {
        transactionRef,
        accountId: source.id,
        entryType: "DEBIT",
        amount,
        currency: source.currency,
        description: `Transfer to ${destination.accountNumber}`
      }
    });

    const credit = await tx.ledgerEntry.create({
      data: {
        transactionRef,
        accountId: destination.id,
        entryType: "CREDIT",
        amount,
        currency: destination.currency,
        description: `Transfer from ${source.accountNumber}`
      }
    });

    return {
      transactionRef,
      debit,
      credit,
      remainingBalance: balance.minus(amount)
    };
  });

  await writeAudit({
    actorId: req.user.id,
    action: "TRANSFER_COMPLETED",
    resourceType: "TRANSACTION",
    resourceId: result.transactionRef,
    metadata: {
      sourceAccountId: sourceId,
      destinationAccountId: destinationId,
      amount: amount.toFixed(2)
    }
  });

  res.status(201).json({
    message: "Transfer completed successfully",
    transactionRef: result.transactionRef,
    debit: result.debit,
    credit: result.credit,
    remainingBalance: result.remainingBalance.toFixed(2)
  });
}));

// Get ledger entries for an account owned by the logged-in user
r.get("/:id/ledger", asyncHandler(async (req, res) => {
  const account = await prisma.account.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    select: { id: true }
  });

  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  const entries = await prisma.ledgerEntry.findMany({
    where: { accountId: account.id },
    orderBy: { createdAt: "desc" }
  });

  res.json({ entries });
}));

export default r;
