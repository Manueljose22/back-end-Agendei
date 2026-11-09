"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const prismaClient_1 = require("../../config/prisma/prismaClient");
class SessionRepository {
    async findByEmail(email) {
        const userPatient = await prismaClient_1.prismaClient.patient.findFirst({
            where: {
                email
            }, select: {
                id: true,
                name: true,
                email: true,
                password: true
            }
        });
        const userHospitails = await prismaClient_1.prismaClient.hospital.findFirst({
            where: {
                email
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true
            }
        });
        return userPatient ?? userHospitails;
    }
}
exports.SessionRepository = SessionRepository;
