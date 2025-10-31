import { Request, Response } from 'express';
import { servicesRequest } from '../../repositories/services/IServicesRepository';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { UpdateServiceServices } from '../../services/services/UpdateServiceServices';




class UpdateServicesController {
    async handle(request: Request, response: Response) {

        const { description, title } = request.body as servicesRequest;
        const { id } = request.params;
        
    
        try {

            const serviceRepository = new ServicesRepository();
            const service = new UpdateServiceServices(serviceRepository);

            const result = await service.execute(id, { title, description });

            return response.json({message: 'Registro actualizado com sucesso!'})

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new UpdateServicesController;