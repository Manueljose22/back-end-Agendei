import { NextFunction, Request, Response } from 'express';
import { AppError } from "../../errors/AppError";
import { GetHospitalByIdService } from '../../services/hospitals/GetHospitalByIdService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';

class GetHospitalByIdControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        try {
            const hospitalsRepository = new HospitalsRepository();
            const service = new GetHospitalByIdService(hospitalsRepository);
            const canViewSuspended = request.isPlatformAdmin === true || request.hospitalId === id;
            const result = await service.execute(id, canViewSuspended);

            return response.json(result);
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new GetHospitalByIdControllers();
