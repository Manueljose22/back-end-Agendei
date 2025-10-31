import { Request, Response } from 'express';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { GetAllServicesService } from '../../services/services/GetAllServicesService';




class GetAllServicesController {

    async handle(request: Request, response: Response) {

        try {

            const serviceRepository = new ServicesRepository();
            const service = new GetAllServicesService(serviceRepository);

            const result = await service.execute();

            return response.json(result);
            
        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetAllServicesController;