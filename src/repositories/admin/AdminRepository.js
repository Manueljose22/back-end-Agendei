"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const prismaClient_1 = require("../../config/prisma/prismaClient");
class AdminRepository {
    async findByName(name) {
        return prismaClient_1.prismaClient.admin.findFirst({ where: { name } });
    }
    async findByEmail(email) {
        return prismaClient_1.prismaClient.admin.findUnique({ where: { email } });
    }
    async findById(id) {
        return prismaClient_1.prismaClient.admin.findUnique({ where: { id } });
    }
    async findAll(search) {
        return prismaClient_1.prismaClient.admin.findMany({
            where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
            orderBy: { createdAt: "desc" },
        });
    }
    async findSearch(search) {
        return this.findAll(search);
    }
    async update(id, data) {
        await prismaClient_1.prismaClient.admin.update({
            where: { id },
            data: { ...data, updatedAt: new Date() },
        });
    }
    async delete(id) {
        await prismaClient_1.prismaClient.$transaction([
            prismaClient_1.prismaClient.authProfile.deleteMany({ where: { role: "admin", profileId: id } }),
            prismaClient_1.prismaClient.admin.delete({ where: { id } }),
        ]);
    }
}
exports.AdminRepository = AdminRepository;
