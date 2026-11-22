import { NextFunction, Request, Response } from "express";
import { NotificationsRepository } from "../../repositories/notifications/NotificationsRepository";
import { MarkNotificationAsReadService } from "../../services/notifications/MarkNotificationAsReadService";

class MarkNotificationAsReadController {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const service = new MarkNotificationAsReadService(new NotificationsRepository());
            await service.execute(request.params.id, request.userId, request.userRole);
            return response.status(200).json({ message: "Notificação marcada como lida." });
        } catch (error) {
            return next(error);
        }
    }
}

export default new MarkNotificationAsReadController();
