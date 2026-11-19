import { NextFunction, Request, Response } from 'express';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { GetAllServicesService } from '../../services/services/GetAllServicesService';




class GetAllServicesController {

    async handle(request: Request, response: Response, next: NextFunction) {

        try {

            const serviceRepository = new ServicesRepository();
            const service = new GetAllServicesService(serviceRepository);

            const result = await service.execute();

            return response.json(result);
            
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new GetAllServicesController;