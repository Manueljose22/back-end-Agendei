import { Request, Response } from 'express';
import { adminRequest } from '../../repositories/admin/IAdminRepository';
import { AdminRepository } from '../../repositories/admin/AdminRepository';
import { AddAdminServices } from '../../services/admin/AddAdminServices';






class AddAdminControllers {
    
    async handle(request: Request, response: Response) {
        
        const data = request.body as adminRequest;
        
        try {

            const adminRepository = new AdminRepository();
            const service = new AddAdminServices(adminRepository);

            const result = await service.execute(data);

            return response.status(201).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new AddAdminControllers;