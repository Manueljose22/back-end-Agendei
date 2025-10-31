import { Request, Response } from 'express';
import { AdminRepository } from '../../repositories/admin/AdminRepository';
import { ListAdminServices } from '../../services/admin/ListAdminServices';






class ListAdminController {

    async handle(request: Request, response: Response) {

        const { search } = request.query;

        try {

            const adminRepository = new AdminRepository();
            const service = new ListAdminServices(adminRepository);

            const result = await service.execute(search as string);

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ListAdminController;