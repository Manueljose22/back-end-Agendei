import { NextFunction, Request, Response } from "express";
import { UpdateSpecialityService } from '../../services/specialities/UpdateSpecialityService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';





class UpdateSpecialityControllers {
    async handle(request: Request, response: Response, next: NextFunction) {

        const { id } = request.params;
        const data = request.body;

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new UpdateSpecialityService(specialityRepository);
            const result = await service.execute(id, data);

            return response.json({ message: "Dados actualizados com sucesso." });

        } catch (error: unknown) {
      return next(error);
    }
    }
}

export default new UpdateSpecialityControllers;