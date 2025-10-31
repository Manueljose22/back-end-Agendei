import { Request, Response } from 'express';
import { AdminRepository } from '../../repositories/admin/AdminRepository';
import { ProfileAdminServices } from '../../services/admin/ProfileAdminServices';





class ProfileAdminControllers {

    async handle(request: Request, response: Response) {

        const { userId } = request;
        
        try {

            const adminRepository = new AdminRepository();
            const service = new ProfileAdminServices(adminRepository);

            const result = await service.execute(userId)

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ProfileAdminControllers;