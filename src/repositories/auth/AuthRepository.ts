import { prismaClient } from "../../config/prisma/prismaClient";
import { AuthProfileRecord, IAuthRepository } from "./IAuthRepository";

export class AuthRepository implements IAuthRepository {
    async createPatientProfile(data: { authUserId: string; name: string; email: string; phone?: string | null }): Promise<AuthProfileRecord> {
        return prismaClient.$transaction(async (transaction) => {
            const patient = await transaction.patient.create({
                data: {
                    id: data.authUserId,
                    name: data.name,
                    email: data.email,
                    phone: data.phone ?? null,
                    password: null,
                },
                select: { id: true },
            });

            return transaction.authProfile.create({
                data: {
                    authUserId: data.authUserId,
                    role: "patient",
                    profileId: patient.id,
                },
                select: {
                    authUserId: true,
                    role: true,
                    profileId: true,
                },
            }) as Promise<AuthProfileRecord>;
        });
    }

    async findProfileByAuthUserId(authUserId: string): Promise<AuthProfileRecord | null> {
        return prismaClient.authProfile.findUnique({
            where: { authUserId },
            select: { authUserId: true, role: true, profileId: true },
        }) as Promise<AuthProfileRecord | null>;
    }
}
