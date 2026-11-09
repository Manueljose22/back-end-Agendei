import { Request, Response } from "express";
import { AddPatientsServices } from "../../services/patients/AddPatientsServices";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { patientsRequest } from "../../repositories/patients/IPatientsRepository";
import {
    uploadFilesWithPaths,
    removeStorageFiles
} from "../../middlewares/upload/uploadsFiles";

class AddPatientsControllers {
    async handle(request: Request, response: Response) {
        let uploadedPath: string | null = null;

        try {
            const data = request.body as patientsRequest;

            if (request.file) {
                const [uploadedFile] = await uploadFilesWithPaths(request.file);
                data.photo = uploadedFile.url;
                uploadedPath = uploadedFile.path;
            }

            const patientsRepository = new PatientsRepository();
            const service = new AddPatientsServices(patientsRepository);
            const result = await service.execute(data);

            return response.status(201).json(result);
        } catch (error: unknown) {
            if (uploadedPath) {
                try {
                    await removeStorageFiles([uploadedPath]);
                } catch (cleanupError) {
                    console.error("Falha ao limpar imagem após erro no cadastro do paciente:", cleanupError);
                }
            }

            const message = error instanceof Error
                ? error.message
                : "Não foi possível cadastrar o paciente.";

            return response.status(400).json({ message });
        }
    }
}

export default new AddPatientsControllers();
