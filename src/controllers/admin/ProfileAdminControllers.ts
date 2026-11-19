import { NextFunction, Request, Response } from 'express';
import { AdminRepository } from '../../repositories/admin/AdminRepository';
import { ProfileAdminServices } from '../../services/admin/ProfileAdminServices';





class ProfileAdminControllers {

    async handle(request: Request, response: Response, next: NextFunction) {

        const { userId } = request;
        
        try {

            const adminRepository = new AdminRepository();
            const service = new ProfileAdminServices(adminRepository);

            const result = await service.execute(userId)

            return response.status(200).json(result);

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new ProfileAdminControllers;