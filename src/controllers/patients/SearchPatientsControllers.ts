import { Request, Response } from "express";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { SearchPatientsServices } from "../../services/patients/SearchPatientsServices";
import { toPatientPublic } from "../../services/patients/patientResponse";

class SearchPatientsControllers {
    async handle(request: Request, response: Response) {
        const { q } = request.query;

        if (typeof q !== "string") {
            return response.status(400).json({ message: "O parâmetro 'q' deve ser um texto." });
        }

        try {
            const repository = new PatientsRepository();
            const service = new SearchPatientsServices(repository);
            const patients = await service.execute(q);

            return response.status(200).json((patients ?? []).map(toPatientPublic));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível pesquisar pacientes.";
            return response.status(400).json({ message });
        }
    }
}
export default new SearchPatientsControllers();
