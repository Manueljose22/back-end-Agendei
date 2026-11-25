import { prismaClient } from "../../config/prisma/prismaClient";
import {
    IPatientsRepository,
    patientsRequest,
    patientsProfileUpdate,
    patientsSave
} from "./IPatientsRepository";

export class PatientsRepository implements IPatientsRepository {
    async updatePassword(id: string, password: string): Promise<void> {
        await prismaClient.patient.update({
            where: { id },
            data: { password, tokenVersion: { increment: 1 } }
        });
    }

    async save(data: patientsRequest): Promise<patientsSave> {
        return prismaClient.patient.create({ data });
    }

    async findByName(name: string): Promise<patientsSave | null> {
        return prismaClient.patient.findFirst({ where: { name } });
    }

    async findByEmail(email: string): Promise<patientsSave | null> {
        return prismaClient.patient.findFirst({ where: { email } });
    }

    async findById(id: string): Promise<patientsSave | null> {
        return prismaClient.patient.findUnique({ where: { id } });
    }

    async findAll(search: string): Promise<patientsSave[]> {
        return prismaClient.patient.findMany({
            where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
            orderBy: { createdAt: "desc" }
        });
    }

    async findSearch(search: string): Promise<patientsSave[]> {
        return prismaClient.patient.findMany({
            take: 10,
            where: {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } }
                ]
            },
            orderBy: { createdAt: "desc" }
        });
    }

    async findByHospital(hospitalId: string, search: string): Promise<patientsSave[]> {
        return prismaClient.patient.findMany({
            where: {
                Appointment: {
                    some: {
                        Doctor: {
                            is: { hospitalId }
                        }
                    }
                },
                ...(search ? {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } }
                    ]
                } : {})
            },
            orderBy: { name: "asc" }
        });
    }

    async update(id: string, data: patientsProfileUpdate): Promise<patientsSave> {
        return prismaClient.patient.update({
            where: { id },
            data: { ...data, updatedAt: new Date() }
        });
    }

    async delete(id: string): Promise<void> {
        await this.deactivate(id);
    }

    async deactivate(id: string): Promise<void> {
        await prismaClient.$transaction(async (tx) => {
            await tx.expoPushToken.deleteMany({ where: { patientId: id } });
            await tx.patient.update({
                where: { id },
                data: {
                name: "Conta eliminada",
                email: null,
                password: null,
                photo: null,
                phone: null,
                dateBirth: null,
                address: null,
                gender: null,
                pushToken: null,
                    tokenVersion: { increment: 1 }
                }
            });
        });
    }
}
