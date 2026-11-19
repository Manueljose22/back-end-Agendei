import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { GetDoctorsByHospitalsServices } from "../../services/doctors/GetDoctorsByHospitalsServices";

class GetDoctorsByHospitalsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const service = new GetDoctorsByHospitalsServices(new DoctorsRepository());
            const result = await service.execute(request.userId);
            return response.status(200).json(result);
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new GetDoctorsByHospitalsControllers();
