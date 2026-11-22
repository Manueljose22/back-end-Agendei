import { prismaClient } from "../../config/prisma/prismaClient";
import { AppError } from "../../errors/AppError";
import { INotificationsRepository, NotificationRecipient } from "./INotificationsRepository";

export class NotificationsRepository implements INotificationsRepository {
    async findAllForRecipient(recipient: NotificationRecipient): Promise<unknown[]> {
        const where = recipient.role === "patient"
            ? { patientId: recipient.userId, recipientRole: "PATIENT" as const }
            : recipient.role === "doctor"
                ? { doctorId: recipient.userId, recipientRole: "DOCTOR" as const }
                : recipient.role === "hospital"
                    ? { hospitalId: recipient.userId, recipientRole: "HOSPITAL" as const }
                    : null;

        if (!where) throw new AppError("Este perfil não possui caixa de notificações.", 403);

        return prismaClient.notification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 100,
            select: {
                id: true,
                title: true,
                message: true,
                type: true,
                data: true,
                isRead: true,
                appointmentId: true,
                rescheduleProposalId: true,
                createdAt: true
            }
        });
    }

    async markAsRead(id: string, recipient: NotificationRecipient): Promise<boolean> {
        const where = recipient.role === "patient"
            ? { id, patientId: recipient.userId, recipientRole: "PATIENT" as const }
            : recipient.role === "doctor"
                ? { id, doctorId: recipient.userId, recipientRole: "DOCTOR" as const }
                : recipient.role === "hospital"
                    ? { id, hospitalId: recipient.userId, recipientRole: "HOSPITAL" as const }
                    : null;

        if (!where) throw new AppError("Este perfil não possui caixa de notificações.", 403);

        const result = await prismaClient.notification.updateMany({
            where,
            data: { isRead: true }
        });
        return result.count === 1;
    }
}
