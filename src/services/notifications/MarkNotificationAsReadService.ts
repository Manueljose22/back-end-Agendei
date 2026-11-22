import { AppError } from "../../errors/AppError";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { INotificationsRepository } from "../../repositories/notifications/INotificationsRepository";

export class MarkNotificationAsReadService {
    constructor(private notificationsRepository: INotificationsRepository) {}

    async execute(id: string, userId: string, role: AccountRole): Promise<void> {
        const updated = await this.notificationsRepository.markAsRead(id, { userId, role });
        if (!updated) throw new AppError("Notificação não encontrada.", 404);
    }
}
