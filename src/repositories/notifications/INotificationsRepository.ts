import { AccountRole } from "../sessions/ISessionsRepository";

export type NotificationRecipient = {
    userId: string;
    role: AccountRole;
};

export interface INotificationsRepository {
    findAllForRecipient(recipient: NotificationRecipient): Promise<unknown[]>;
    markAsRead(id: string, recipient: NotificationRecipient): Promise<boolean>;
}
