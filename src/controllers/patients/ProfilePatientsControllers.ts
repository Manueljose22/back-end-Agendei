import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { ProfilePatientsServices } from "../../services/patients/ProfilePatientsServices";
import { toPatientPublic } from "../../services/patients/patientResponse";

class ProfilePatientsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const repository = new PatientsRepository();
            const service = new ProfilePatientsServices(repository);
            const result = await service.execute(request.userId);

            return response.status(200).json(result ? toPatientPublic(result) : null);
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new ProfilePatientsControllers();
