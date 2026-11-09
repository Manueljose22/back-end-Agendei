import { Request, Response } from 'express';
import { AddAdminServices } from '../../services/admin/AddAdminServices';

class AddAdminControllers {
    async handle(request: Request, response: Response) {
        try {
            const service = new AddAdminServices();
            const result = await service.execute(request.body);

            return response.status(201).json(result);
        } catch (error: any) {
            return response.status(400).json({ message: error.message });
        }
    }
}

export default new AddAdminControllers;