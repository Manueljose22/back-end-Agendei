import { NextFunction, Request, Response } from 'express';
import { AdminRepository } from '../../repositories/admin/AdminRepository';
import { DeleteAdminServices } from '../../services/admin/DeleteAdminServices';





class DeleteAdminControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        
        const { id } = request.params;

        try {

            const adminRepository = new AdminRepository();
            const service = new DeleteAdminServices(adminRepository);

            const result = await service.execute(id);

            return response.status(200).json({ message: 'Registro excluído com sucesso.' })

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new DeleteAdminControllers;