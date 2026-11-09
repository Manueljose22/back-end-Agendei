import { Request, Response } from "express";
import { patientsRequest } from "../../repositories/patients/IPatientsRepository";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { UpdatePatientsServices } from "../../services/patients/UpdatePatientsServices";
import { uploadsFiles } from "../../middlewares/upload/uploadsFiles";

class UpdatePatientsControllers {

    async handle(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const data = request.body as patientsRequest;

            if (request.file) {
                data.photo = await uploadsFiles(request.file) as string;
            }

            const patientsRepository = new PatientsRepository();
            const service = new UpdatePatientsServices(patientsRepository);

            await service.execute(id, data);

            return response.status(200).json({
                message: "Dados do paciente actualizados com sucesso."
            });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível actualizar os dados do paciente.";

            return response.status(400).json({ message });
        }
    }
}

export default new UpdatePatientsControllers();