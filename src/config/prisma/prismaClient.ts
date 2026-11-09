import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const prismaLog = process.env.NODE_ENV === "development"
  ? ["query", "error", "warn"] as const
  : ["error"] as const;

export const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({ log: [...prismaLog] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}
