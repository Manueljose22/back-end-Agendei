import { Request, Response } from 'express';
import { servicesRequest } from '../../repositories/services/IServicesRepository';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { CreateServiceServices } from '../../services/services/CreateServiceServices';




class CreateServicesController {
    async handle(request: Request, response: Response) {

        const data = request.body as servicesRequest;
        
        try {

            const servicesRepository = new ServicesRepository();
            const service = new CreateServiceServices(servicesRepository);

            const result = await service.execute(data);

            return response.status(201).json({message: "Serviço criado com sucesso!"});

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new CreateServicesController;