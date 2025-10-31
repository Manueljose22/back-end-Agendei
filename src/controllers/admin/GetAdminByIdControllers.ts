import { Request, Response } from 'express';
import { AdminRepository } from '../../repositories/admin/AdminRepository';
import { GetAdminByIdServices } from '../../services/admin/GetAdminByIdServices';




class GetAdminByIdControllers {

    async handle(request: Request, response: Response) {

        const { id } = request.params;

        try {

            const adminRepository = new AdminRepository();
            const service = new GetAdminByIdServices(adminRepository);

            const result = await service.execute(id)

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetAdminByIdControllers;