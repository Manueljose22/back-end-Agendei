import { NextFunction, Request, Response } from 'express';
import { AppError } from "../../errors/AppError";
import { ListHospitalsService } from '../../services/hospitals/ListHospitalsService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';

class ListHospitalsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const hospitalsRepository = new HospitalsRepository();
            const service = new ListHospitalsService(hospitalsRepository);
            const result = await service.execute(
                request.hospitalId,
                request.isPlatformAdmin
            );

            return response.json(result);
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new ListHospitalsControllers();
