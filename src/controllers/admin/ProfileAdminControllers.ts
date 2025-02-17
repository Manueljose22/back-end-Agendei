import { Request, Response } from 'express';
import { UsersRepository } from '../../repositorys/clients/ClientsRepository';
import { ProfileUsersServices } from '../../services/clients/ProfileClientsServices';
import { AdminRepository } from '../../repositorys/admin/AdminRepository';





class ProfileAdminControllers {

    async handle(request: Request, response: Response) {

        const { userId } = request;
        
        try {

            const adminRepository = new AdminRepository();
            const service = new ProfileUsersServices(adminRepository);

            const result = await service.execute(userId)

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ProfileAdminControllers;