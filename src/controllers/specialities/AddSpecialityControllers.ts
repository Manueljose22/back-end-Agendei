import { NextFunction, Request, Response } from 'express';
import { AddSpecialityService } from '../../services/specialities/AddSpecialityService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';

class AddSpecialityControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const data = {
            ...request.body,
            hospitalId: request.userId
        };

        try {
            const service = new AddSpecialityService(new SpecialityRepository());
            await service.execute(data);
            return response.status(201).json({ message: "Especialidade cadastrada com sucesso." });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new AddSpecialityControllers();
