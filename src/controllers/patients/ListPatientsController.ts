import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { ListPatientsServices } from "../../services/patients/ListPatientsServices";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { toPatientPublic } from "../../services/patients/patientResponse";

class ListPatientsController {
    async handle(request: Request, response: Response, next: NextFunction) {
        const search = typeof request.query.search === "string" ? request.query.search : "";

        try {
            const repository = new PatientsRepository();
            const service = new ListPatientsServices(repository);
            const result = await service.execute(search);

            return response.status(200).json((result ?? []).map(toPatientPublic));
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new ListPatientsController();
