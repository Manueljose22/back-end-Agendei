import { NextFunction, Request, Response } from 'express';
import { AdminRepository } from '../../repositories/admin/AdminRepository';
import { ListAdminServices } from '../../services/admin/ListAdminServices';






class ListAdminController {

    async handle(request: Request, response: Response, next: NextFunction) {

        const { search } = request.query;

        try {

            const adminRepository = new AdminRepository();
            const service = new ListAdminServices(adminRepository);

            const result = await service.execute(search as string);

            return response.status(200).json(result);

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new ListAdminController;