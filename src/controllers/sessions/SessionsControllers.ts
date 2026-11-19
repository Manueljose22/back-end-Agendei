import { NextFunction, Request, Response } from 'express';
import { payloadRequest } from '../../repositories/sessions/ISessionsRepository';
import { SessionRepository } from '../../repositories/sessions/SessionsRepository';
import { SessionServices } from '../../services/session/SessionServices';




class SessionsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {

        const { email, password } = request.body as payloadRequest;
        try {

            const sessionRepository = new SessionRepository();
            const service = new SessionServices(sessionRepository);

            const result = await service.execute({ email, password });

            return response.status(200).json(result);

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new SessionsControllers;