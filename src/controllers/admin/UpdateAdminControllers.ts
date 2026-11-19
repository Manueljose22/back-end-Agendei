import { NextFunction, Request, Response } from 'express';
import { AdminRepository } from '../../repositories/admin/AdminRepository';
import { UpdateAdminServices } from '../../services/admin/UpdateAdminServices';





class UpdateAdminControllers {

    async handle(request: Request, response: Response, next: NextFunction) {

        const { id } = request.params;
        const data = request.body

        try {

            const adminRepository = new AdminRepository();
            const service = new UpdateAdminServices(adminRepository);

            const result = await service.execute(id, data);

            return response.json({message: 'Dados actualizados com sucesso.'});

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new UpdateAdminControllers;