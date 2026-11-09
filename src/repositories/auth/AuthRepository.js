"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const prismaClient_1 = require("../../config/prisma/prismaClient");
class AuthRepository {
    async createPatientProfile(data) {
        return prismaClient_1.prismaClient.$transaction(async (transaction) => {
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
            });
        });
    }
    async findProfileByAuthUserId(authUserId) {
        return prismaClient_1.prismaClient.authProfile.findUnique({
            where: { authUserId },
            select: { authUserId: true, role: true, profileId: true },
        });
    }
}
exports.AuthRepository = AuthRepository;
