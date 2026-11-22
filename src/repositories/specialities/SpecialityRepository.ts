import { prismaClient } from "../../config/prisma/prismaClient";
import { specialityInput, ISpecialityRepository, specialitySaved } from "./ISpecialityRepository";

export class SpecialityRepository implements ISpecialityRepository {
    async findByHospitails(id: string): Promise<specialitySaved[]> {
        return prismaClient.specialty.findMany({ where: { hospitalId: id } });
    }

    async create(data: specialityInput): Promise<specialitySaved> {
        return prismaClient.specialty.create({ data });
    }

    async findById(id: string, hospitalId?: string): Promise<specialitySaved> {
        return prismaClient.specialty.findFirst({
            where: { id, ...(hospitalId ? { hospitalId } : {}) }
        });
    }

    async findByName(name: string): Promise<specialitySaved> {
        return prismaClient.specialty.findFirst({ where: { name } });
    }

    async findAll(): Promise<specialitySaved[] | null> {
        return prismaClient.specialty.findMany({ include: { doctor: false } });
    }

    async findSearch(search: string): Promise<specialitySaved[] | null> {
        return prismaClient.specialty.findMany({
            take: 10,
            where: { name: { contains: search, mode: "insensitive" } }
        });
    }

    async update(
        id: string,
        { name, color, description }: Omit<specialityInput, "hospitalId">,
        hospitalId: string
    ): Promise<boolean> {
        const result = await prismaClient.specialty.updateMany({
            where: { id, hospitalId },
            data: { name, color, description, updatedAt: new Date() }
        });
        return result.count > 0;
    }

    async delete(id: string, hospitalId: string): Promise<boolean> {
        const result = await prismaClient.specialty.deleteMany({
            where: { id, hospitalId }
        });
        return result.count > 0;
    }
}
