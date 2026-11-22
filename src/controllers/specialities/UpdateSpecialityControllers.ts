import { NextFunction, Request, Response } from "express";
import { UpdateSpecialityService } from '../../services/specialities/UpdateSpecialityService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';

class UpdateSpecialityControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
        try {
            const service = new UpdateSpecialityService(new SpecialityRepository());
            await service.execute(id, request.userId, request.body);
            return response.json({ message: "Dados actualizados com sucesso." });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new UpdateSpecialityControllers();
