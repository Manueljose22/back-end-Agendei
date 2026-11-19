import { NextFunction, Request, Response } from 'express';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { GetByIdServicesService } from '../../services/services/GetByIdServicesService';




class GetByIdServicesController {

    async handle(request: Request, response: Response, next: NextFunction) {

        const { id } = request.params;

        try {

            const serviceRepository = new ServicesRepository();
            const service = new GetByIdServicesService(serviceRepository);

            const result = await service.execute(id);

            return response.json(result);

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new GetByIdServicesController;