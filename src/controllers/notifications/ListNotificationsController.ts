import { NextFunction, Request, Response } from "express";
import { NotificationsRepository } from "../../repositories/notifications/NotificationsRepository";
import { ListNotificationsService } from "../../services/notifications/ListNotificationsService";

class ListNotificationsController {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const service = new ListNotificationsService(new NotificationsRepository());
            const notifications = await service.execute(request.userId, request.userRole);
            return response.status(200).json({ notifications });
        } catch (error) {
            return next(error);
        }
    }
}

export default new ListNotificationsController();
