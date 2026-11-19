import { NextFunction, Request, Response } from 'express';
import { AddAdminServices } from '../../services/admin/AddAdminServices';

class AddAdminControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const service = new AddAdminServices();
            const result = await service.execute(request.body);

            return response.status(201).json(result);
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new AddAdminControllers;