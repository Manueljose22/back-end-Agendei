import { prismaClient } from "../../config/prisma/prismaClient";
import { ISessionRepository, payloadSave } from "./ISessionsRepository";

export class SessionRepository implements ISessionRepository {
    async findByEmail(email: string): Promise<payloadSave | null> {
        const [patient, hospital, doctor, admin] = await Promise.all([
            prismaClient.patient.findUnique({
                where: { email },
                select: { id: true, name: true, email: true, password: true }
            }),
            prismaClient.hospital.findUnique({
                where: { email },
                select: { id: true, name: true, email: true, password: true }
            }),
            prismaClient.doctor.findUnique({
                where: { email },
                select: { id: true, name: true, email: true, password: true }
            }),
            prismaClient.admin.findUnique({
                where: { email },
                select: { id: true, name: true, email: true, passwordHash: true }
            })
        ]);

        const matches: payloadSave[] = [];

        if (patient?.password && patient.email) {
            matches.push({ ...patient, password: patient.password, role: "patient" });
        }
        if (hospital?.password && hospital.email) {
            matches.push({ ...hospital, password: hospital.password, role: "hospital" });
        }
        if (doctor?.password && doctor.email) {
            matches.push({ ...doctor, password: doctor.password, role: "doctor" });
        }
        if (admin?.passwordHash) {
            matches.push({
                id: admin.id,
                name: admin.name,
                email: admin.email,
                password: admin.passwordHash,
                role: "platform_admin"
            });
        }

        if (matches.length > 1) {
            throw new Error("Existem contas com este email em mais de um perfil. Contacte o suporte.");
        }

        return matches[0] ?? null;
    }
}
