import { Request, Response } from "express";
import { AddPatientsServices } from "../../services/patients/AddPatientsServices";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { patientsRequest } from "../../repositories/patients/IPatientsRepository";
import { uploadsFiles } from "../../middlewares/upload/uploadsFiles";

class AddPatientsControllers {

    async handle(request: Request, response: Response) {
        try {
            const data = request.body as patientsRequest;

            if (request.file) {
                data.photo = await uploadsFiles(request.file) as string;
            }

            const patientsRepository = new PatientsRepository();
            const service = new AddPatientsServices(patientsRepository);

            const result = await service.execute(data);

            return response.status(201).json(result);

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível cadastrar o paciente.";

            return response.status(400).json({ message });
        }
    }
}

export default new AddPatientsControllers();