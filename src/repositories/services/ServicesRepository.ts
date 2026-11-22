import { prismaClient } from "../../config/prisma/prismaClient";
import { IServicesRepository, servicesRequest, servicesSaved } from "./IServicesRepository";

export class ServicesRepository implements IServicesRepository {
    async save(data: servicesRequest): Promise<void> {
        await prismaClient.service.create({
            data: {
                title: data.title,
                price: Number(data.price),
                duraction: data.duraction,
                description: data.description,
                specialtyId: data.specialtyId!,
                status: data.status
            }
        });
    }

    async findAll(): Promise<servicesSaved[] | null> {
        return prismaClient.service.findMany({
            include: {
                specialty: { select: { id: true, name: true } }
            }
        });
    }

    async findAllHospital(hospitalId: string): Promise<servicesSaved[] | null> {
        return prismaClient.service.findMany({
            where: { specialty: { hospitalId } },
            include: {
                specialty: { select: { id: true, name: true } }
            }
        });
    }

    async findById(id: string, hospitalId?: string): Promise<servicesSaved | null> {
        return prismaClient.service.findFirst({
            where: {
                id,
                ...(hospitalId ? { specialty: { hospitalId } } : {})
            },
            include: {
                specialty: { select: { id: true, name: true } }
            }
        });
    }

    async findByName(title: string): Promise<servicesSaved | null> {
        return prismaClient.service.findFirst({
            where: { title },
            include: {
                specialty: { select: { id: true, name: true } }
            }
        });
    }

    async specialtyBelongsToHospital(specialtyId: string, hospitalId: string): Promise<boolean> {
        const specialty = await prismaClient.specialty.findFirst({
            where: { id: specialtyId, hospitalId },
            select: { id: true }
        });
        return Boolean(specialty);
    }

    async update(id: string, data: servicesRequest, hospitalId: string): Promise<boolean> {
        const result = await prismaClient.service.updateMany({
            where: { id, specialty: { hospitalId } },
            data: {
                title: data.title,
                price: Number(data.price),
                duraction: data.duraction,
                description: data.description,
                specialtyId: data.specialtyId!,
                status: data.status
            }
        });
        return result.count > 0;
    }

    async delete(id: string, hospitalId: string): Promise<boolean> {
        const result = await prismaClient.service.deleteMany({
            where: { id, specialty: { hospitalId } }
        });
        return result.count > 0;
    }
}
