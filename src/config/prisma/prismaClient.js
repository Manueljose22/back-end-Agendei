"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
const prismaLog = process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"];
exports.prismaClient = globalForPrisma.prisma ??
    new client_1.PrismaClient({ log: [...prismaLog] });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prismaClient;
}
