import { NextFunction, Request, Response } from 'express';
import { servicesRequest } from '../../repositories/services/IServicesRepository';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { UpdateServiceServices } from '../../services/services/UpdateServiceServices';




class UpdateServicesController {
    async handle(request: Request, response: Response, next: NextFunction) {

        const data = request.body as servicesRequest;
        const { id } = request.params;
        
        try {
            const serviceRepository = new ServicesRepository();
            const service = new UpdateServiceServices(serviceRepository);

            const result = await service.execute(id, data);

            return response.json({message: 'Registro actualizado com sucesso!'})

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new UpdateServicesController;