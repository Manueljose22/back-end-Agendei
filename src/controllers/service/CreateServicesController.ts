import { Request, Response } from 'express';
import { servicesRequest } from '../../repositorys/services/IServicesRepository';
import { ServicesRepository } from '../../repositorys/services/ServicesRepository';
import { CreateServiceServices } from '../../services/services/CreateServiceServices';




class CreateServicesController {
    async handle(request: Request, response: Response) {

        const {title, description} = request.body as servicesRequest;
        
        try {

            const servicesRepository = new ServicesRepository();
            const service = new CreateServiceServices(servicesRepository);

            const result = await service.execute({title, description});

            return response.status(201).json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new CreateServicesController;