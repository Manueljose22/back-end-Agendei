import { prismaClient } from "../../config/prisma/prismaClient";
import { IAdminRepository, adminSave, adminUpdate } from "./IAdminRepository";

export class AdminRepository implements IAdminRepository {
    async findByName(name: string): Promise<adminSave | null> {
        return prismaClient.admin.findFirst({ where: { name } });
    }

    async findByEmail(email: string): Promise<adminSave | null> {
        return prismaClient.admin.findUnique({ where: { email } });
    }

    async findById(id: string): Promise<adminSave | null> {
        return prismaClient.admin.findUnique({ where: { id } });
    }

    async findAll(search: string): Promise<adminSave[]> {
        return prismaClient.admin.findMany({
            where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
            orderBy: { createdAt: "desc" },
        });
    }

    async findSearch(search: string): Promise<adminSave[]> {
        return this.findAll(search);
    }

    async update(id: string, data: adminUpdate): Promise<void> {
        await prismaClient.admin.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    }

    async delete(id: string): Promise<void> {
        await prismaClient.admin.delete({ where: { id } });
    }
}
