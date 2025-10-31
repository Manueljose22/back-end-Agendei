import { Request, Response } from 'express';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { GetByIdServicesService } from '../../services/services/GetByIdServicesService';




class GetByIdServicesController {

    async handle(request: Request, response: Response) {

        const { id } = request.params;

        try {

            const serviceRepository = new ServicesRepository();
            const service = new GetByIdServicesService(serviceRepository);

            const result = await service.execute(id);

            return response.json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetByIdServicesController;