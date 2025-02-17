import { Request, Response } from 'express';
import { DeleteUsersServices } from '../../services/clients/DeleteClientsServices';
import { AdminRepository } from '../../repositorys/admin/AdminRepository';





class DeleteAdminControllers {
    async handle(request: Request, response: Response) {
        
        const { id } = request.params;

        try {

            const adminRepository = new AdminRepository();
            const service = new DeleteUsersServices(adminRepository);

            const result = await service.execute(id);

            return response.status(200).json({ message: 'Registro excluído com sucesso.' })

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new DeleteAdminControllers;