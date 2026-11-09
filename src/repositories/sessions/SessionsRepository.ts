import { prismaClient } from "../../config/prisma/prismaClient";
import { ISessionRepository, payloadSave } from "./ISessionsRepository";

export class SessionRepository implements ISessionRepository {
    async findByEmail(email: string): Promise<payloadSave | null> {
        const patient = await prismaClient.patient.findUnique({ where: { email }, select: { id: true, name: true, email: true, password: true } });
        const hospital = await prismaClient.hospital.findUnique({ where: { email }, select: { id: true, name: true, email: true, password: true } });
        const doctor = await prismaClient.doctor.findUnique({ where: { email }, select: { id: true, name: true, email: true, password: true } });
        const admin = await prismaClient.admin.findUnique({ where: { email }, select: { id: true, name: true, email: true, passwordHash: true } });

        const matches: payloadSave[] = [];
        for (const account of [patient, hospital, doctor]) {
            if (account?.password && account.email) matches.push({ id: account.id, name: account.name, email: account.email, password: account.password });
        }
        if (admin?.passwordHash) matches.push({ id: admin.id, name: admin.name, email: admin.email, password: admin.passwordHash });
        if (matches.length > 1) throw new Error("Existem contas com este email em mais de um perfil. Contacte o suporte.");
        return matches[0] ?? null;
    }
}
