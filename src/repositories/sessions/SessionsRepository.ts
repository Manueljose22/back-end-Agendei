import { prismaClient } from "../../config/prisma/prismaClient";
import { ISessionRepository, payloadSave } from "./ISessionsRepository";

export class SessionRepository implements ISessionRepository {
    async findByEmail(email: string): Promise<payloadSave | null> {
        const userPatient = await prismaClient.patient.findFirst({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true
            }
        });

        if (userPatient?.email && userPatient.password) {
            return {
                id: userPatient.id,
                name: userPatient.name,
                email: userPatient.email,
                password: userPatient.password
            };
        }

        const userHospital = await prismaClient.hospital.findFirst({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true
            }
        });

        if (userHospital?.email && userHospital.password) {
            return {
                id: userHospital.id,
                name: userHospital.name,
                email: userHospital.email,
                password: userHospital.password
            };
        }

        return null;
    }
}