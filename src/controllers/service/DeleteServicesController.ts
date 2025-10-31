import { Request, Response } from 'express';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { DeleteServicesService } from '../../services/services/DeleteServicesService';




class DeleteServicesController {

    async handle(request: Request, response: Response) {

        const { id } = request.params;

        try {

            const serviceRepository = new ServicesRepository();
            const service = new DeleteServicesService(serviceRepository);

            const result = await service.execute(id);

            return response.json({ message: 'Registro eliminado com sucesso!' });

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new DeleteServicesController;