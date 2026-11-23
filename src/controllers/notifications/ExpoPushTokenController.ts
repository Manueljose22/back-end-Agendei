import { NextFunction, Request, Response } from "express";
import { ExpoPushTokensRepository } from "../../repositories/notifications/ExpoPushTokensRepository";
import { RegisterExpoPushTokenService } from "../../services/notifications/RegisterExpoPushTokenService";

class ExpoPushTokenController {
    async register(request: Request, response: Response, next: NextFunction) {
        try {
            const service = new RegisterExpoPushTokenService(new ExpoPushTokensRepository());
            await service.register(request.body?.expoPushToken, request.userId, request.userRole);
            return response.status(200).json({ message: "Dispositivo registado para notificações push." });
        } catch (error) {
            return next(error);
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const service = new RegisterExpoPushTokenService(new ExpoPushTokensRepository());
            await service.remove(request.body?.expoPushToken, request.userId, request.userRole);
            return response.status(200).json({ message: "Dispositivo removido das notificações push." });
        } catch (error) {
            return next(error);
        }
    }
}

export default new ExpoPushTokenController();
