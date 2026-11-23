import { NotificationRecipientRole, Prisma } from "@prisma/client";
import { prismaClient } from "../../config/prisma/prismaClient";
import { AppError } from "../../errors/AppError";
import { AccountRole } from "../sessions/ISessionsRepository";

export type PushRecipient = {
    userId: string;
    role: Exclude<AccountRole, "platform_admin">;
};

export class ExpoPushTokensRepository {
    async register(token: string, recipient: PushRecipient): Promise<void> {
        const recipientRole = recipient.role.toUpperCase() as NotificationRecipientRole;
        const owner = {
            patientId: recipient.role === "patient" ? recipient.userId : null,
            doctorId: recipient.role === "doctor" ? recipient.userId : null,
            hospitalId: recipient.role === "hospital" ? recipient.userId : null
        };

        const existing = await prismaClient.expoPushToken.findUnique({
            where: { token },
            select: {
                recipientRole: true,
                patientId: true,
                doctorId: true,
                hospitalId: true
            }
        });

        if (existing) {
            const sameOwner = existing.recipientRole === recipientRole
                && existing.patientId === owner.patientId
                && existing.doctorId === owner.doctorId
                && existing.hospitalId === owner.hospitalId;

            if (!sameOwner) {
                throw new AppError("Este dispositivo já está associado a outra conta. Termine a sessão anterior e remova o token antes de o reutilizar.", 409);
            }

            await prismaClient.expoPushToken.update({
                where: { token },
                data: { updatedAt: new Date() }
            });
            return;
        }

        try {
            await prismaClient.expoPushToken.create({
                data: { token, recipientRole, ...owner }
            });
        } catch (error) {
            if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
                throw error;
            }
            // Uma inscrição concorrente pode ter criado o mesmo token entretanto.
            const racedToken = await prismaClient.expoPushToken.findUnique({
                where: { token },
                select: {
                    recipientRole: true,
                    patientId: true,
                    doctorId: true,
                    hospitalId: true
                }
            });
            const sameOwner = racedToken
                && racedToken.recipientRole === recipientRole
                && racedToken.patientId === owner.patientId
                && racedToken.doctorId === owner.doctorId
                && racedToken.hospitalId === owner.hospitalId;

            if (!sameOwner) throw new AppError("Não foi possível associar este dispositivo à conta.", 409);
        }
    }

    async remove(token: string, recipient: PushRecipient): Promise<void> {
        const owner = recipient.role === "patient"
            ? { patientId: recipient.userId, recipientRole: "PATIENT" as const }
            : recipient.role === "doctor"
                ? { doctorId: recipient.userId, recipientRole: "DOCTOR" as const }
                : { hospitalId: recipient.userId, recipientRole: "HOSPITAL" as const };

        await prismaClient.expoPushToken.deleteMany({ where: { token, ...owner } });
    }
}
