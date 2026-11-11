import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";
export const prisma = new PrismaClient({ log: env.NODE_ENV === "development" ? ["warn","error"] : ["error"] });
// Separate least-privilege login: this client is only used to INSERT audit records.
export const auditPrisma = new PrismaClient({ datasources:{db:{url:env.AUDIT_DATABASE_URL}}, log:["error"] });
