import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { SearchPatientsServices } from "../../services/patients/SearchPatientsServices";
import { toPatientPublic } from "../../services/patients/patientResponse";

class SearchPatientsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { q } = request.query;

        if (typeof q !== "string") {
            return next(new AppError("O parâmetro 'q' deve ser um texto.", 400));
        }

        try {
            const repository = new PatientsRepository();
            const service = new SearchPatientsServices(repository);
            const patients = await service.execute(q);

            return response.status(200).json((patients ?? []).map(toPatientPublic));
        } catch (error: unknown) {
            return next(error);
        }
    }
}
export default new SearchPatientsControllers();
