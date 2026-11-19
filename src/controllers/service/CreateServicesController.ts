import { NextFunction, Request, Response } from 'express';
import { servicesRequest } from '../../repositories/services/IServicesRepository';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { CreateServiceServices } from '../../services/services/CreateServiceServices';

class CreateServicesController {
    async handle(request: Request, response: Response, next: NextFunction) {
        const data = request.body as servicesRequest;

        try {
            const servicesRepository = new ServicesRepository();
            const service = new CreateServiceServices(servicesRepository);

            await service.execute(data);

            return response.status(201).json({ message: "Serviço criado com sucesso!" });
        } catch (error) {
            return next(error);
        }
    }
}

export default new CreateServicesController;
