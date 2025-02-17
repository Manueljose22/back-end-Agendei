import { Request, Response } from 'express';
import { usersRequest } from '../../repositorys/clients/IClientsRepository';
import { AdminRepository } from '../../repositorys/admin/AdminRepository';
import { UpdateAdminServices } from '../../services/admin/UpdateAdminServices';





class UpdateAdminControllers {

    async handle(request: Request, response: Response) {

        const { id } = request.params;
        const data = request.body as usersRequest;

        try {

            const adminRepository = new AdminRepository();
            const service = new UpdateAdminServices(adminRepository);

            const result = await service.execute(id, data);

            return response.json({message: 'Dados actualizados com sucesso.'});

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new UpdateAdminControllers;