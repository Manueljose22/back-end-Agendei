import { NotificationRecipientRole } from "@prisma/client";
import { prismaClient } from "../../config/prisma/prismaClient";
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

        await prismaClient.expoPushToken.upsert({
            where: { token },
            create: { token, recipientRole, ...owner },
            update: { recipientRole, ...owner, updatedAt: new Date() }
        });
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
