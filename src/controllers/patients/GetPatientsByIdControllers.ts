import { Request, Response } from "express";
import { GetPatientsByIdServices } from "../../services/patients/GetPatientsByIdServices";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { toPatientPublic } from "../../services/patients/patientResponse";

class GetPatientsByIdControllers {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        if (request.userRole === "patient" && request.userId !== id) {
            return response.status(404).json({ message: "Paciente não encontrado." });
        }

        try {
            const repository = new PatientsRepository();
            const service = new GetPatientsByIdServices(repository);
            const result = await service.execute(id);

            return response.status(200).json(result ? toPatientPublic(result) : null);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível consultar o paciente.";
            return response.status(404).json({ message });
        }
    }
}

export default new GetPatientsByIdControllers();
