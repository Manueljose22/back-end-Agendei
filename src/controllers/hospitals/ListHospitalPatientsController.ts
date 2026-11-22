import { NextFunction, Request, Response } from "express";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { toPatientPublic } from "../../services/patients/patientResponse";
import { ListHospitalPatientsService } from "../../services/hospitals/ListHospitalPatientsService";

class ListHospitalPatientsController {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const hospitalId = request.userId;
            const search = typeof request.query.search === "string" ? request.query.search : "";

            const repository = new PatientsRepository();
            const service = new ListHospitalPatientsService(repository);
            const patients = await service.execute(hospitalId, search);

            return response.status(200).json(patients.map(toPatientPublic));
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new ListHospitalPatientsController();
