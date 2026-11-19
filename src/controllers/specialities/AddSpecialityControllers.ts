import { NextFunction, Request, Response } from 'express';
import { AddSpecialityService } from '../../services/specialities/AddSpecialityService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';





class AddSpecialityControllers {
    async handle(request: Request, response: Response, next: NextFunction) {

        const data = request.body;
        const {userId} = request;
        
        data.hospitalId = userId;

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new AddSpecialityService(specialityRepository);
            const result = await service.execute(data)

            return response.status(201).json({ message: "Especialidade cadastrada com sucesso." })

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new AddSpecialityControllers;