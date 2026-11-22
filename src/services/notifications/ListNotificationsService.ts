import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { INotificationsRepository } from "../../repositories/notifications/INotificationsRepository";

export class ListNotificationsService {
    constructor(private notificationsRepository: INotificationsRepository) {}

    execute(userId: string, role: AccountRole) {
        return this.notificationsRepository.findAllForRecipient({ userId, role });
    }
}
