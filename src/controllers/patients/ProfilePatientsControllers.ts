import { Request, Response } from "express";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { ProfilePatientsServices } from "../../services/patients/ProfilePatientsServices";
import { toPatientPublic } from "../../services/patients/patientResponse";

class ProfilePatientsControllers {
    async handle(request: Request, response: Response) {
        try {
            const repository = new PatientsRepository();
            const service = new ProfilePatientsServices(repository);
            const result = await service.execute(request.userId);

            return response.status(200).json(result ? toPatientPublic(result) : null);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível consultar o perfil.";
            return response.status(404).json({ message });
        }
    }
}

export default new ProfilePatientsControllers();
