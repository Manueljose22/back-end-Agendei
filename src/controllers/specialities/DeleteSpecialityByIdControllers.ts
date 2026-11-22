import { NextFunction, Request, Response } from 'express';
import { DeleteSpecialityByIdService } from '../../services/specialities/DeleteSpecialityByIdService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';

class DeleteSpecialityByIdControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
        try {
            const service = new DeleteSpecialityByIdService(new SpecialityRepository());
            await service.execute(id, request.userId);
            return response.json({ message: "Especialidade eliminada com sucesso." });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new DeleteSpecialityByIdControllers();
