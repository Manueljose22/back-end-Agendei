import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { GetPatientsByIdServices } from "../../services/patients/GetPatientsByIdServices";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { toPatientPublic } from "../../services/patients/patientResponse";

class GetPatientsByIdControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        if (request.userRole === "patient" && request.userId !== id) {
            return next(new AppError("Paciente não encontrado.", 404));
        }

        try {
            const repository = new PatientsRepository();
            const service = new GetPatientsByIdServices(repository);
            const result = await service.execute(id);

            return response.status(200).json(result ? toPatientPublic(result) : null);
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new GetPatientsByIdControllers();
