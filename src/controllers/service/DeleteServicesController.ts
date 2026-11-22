import { NextFunction, Request, Response } from 'express';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { DeleteServicesService } from '../../services/services/DeleteServicesService';

class DeleteServicesController {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
        try {
            const service = new DeleteServicesService(new ServicesRepository());
            await service.execute(id, request.userId);
            return response.json({ message: 'Registro eliminado com sucesso!' });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new DeleteServicesController();
