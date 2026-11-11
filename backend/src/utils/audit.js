
import { randomUUID } from "node:crypto";
import { auditPrisma } from "../db/prisma.js";

export async function writeAudit({
  actorId = null,
  action,
  resourceType,
  resourceId = null,
  outcome = "SUCCESS",
  metadata = {},
}) {
  await auditPrisma.$executeRaw`
    INSERT INTO public.audit_logs (
      id,
      actor_id,
      action,
      resource_type,
      resource_id,
      outcome,
      metadata
    )
    VALUES (
      ${randomUUID()}::uuid,
      ${actorId}::uuid,
      ${action},
      ${resourceType},
      ${resourceId},
      ${outcome},
      ${JSON.stringify(metadata)}::jsonb
    )
  `;
}
