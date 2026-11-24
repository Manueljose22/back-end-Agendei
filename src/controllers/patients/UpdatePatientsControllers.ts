
import { Request, Response } from "express";
import { patientsRequest } from "../../repositories/patients/IPatientsRepository";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { UpdatePatientsServices } from "../../services/patients/UpdatePatientsServices";
import {
    uploadFilesWithPaths,
    removeStorageFiles,
    getStoragePathFromPublicUrl
} from "../../middlewares/upload/uploadsFiles";

class UpdatePatientsControllers {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
        let uploadedPath: string | null = null;

        try {
            const data = request.body as patientsRequest;
            const rawDateBirth = request.body.dateBirth as unknown;

            // O Multer recebe campos multipart como strings; converter a data
            // antes de a enviar ao Prisma (e preservar a data actual se vier vazia).
            if (typeof rawDateBirth === "string") {
                if (rawDateBirth.trim() === "") {
                    data.dateBirth = null;
                } else {
                    const parsedDate = new Date(rawDateBirth);
                    if (Number.isNaN(parsedDate.getTime())) {
                        throw new Error("Data de nascimento inválida. Use o formato AAAA-MM-DD.");
                    }
                    data.dateBirth = parsedDate;
                }
            }

            if (request.file) {
                const [uploadedFile] = await uploadFilesWithPaths(request.file);
                data.photo = uploadedFile.url;
                uploadedPath = uploadedFile.path;
            }

            const patientsRepository = new PatientsRepository();
            const service = new UpdatePatientsServices(patientsRepository);

            const result = await service.execute(id, data);

            if (uploadedPath) {
                const previousPath = getStoragePathFromPublicUrl(
                    result.previousPhoto
                );

                if (previousPath && previousPath !== uploadedPath) {
                    try {
                        await removeStorageFiles([previousPath]);
                    } catch (cleanupError) {
                        console.error(
                            "Falha ao remover a fotografia anterior do paciente:",
                            cleanupError
                        );
                    }
                }
            }

            return response.status(200).json({
                message: "Dados do paciente actualizados com sucesso."
            });
        } catch (error: unknown) {
            if (uploadedPath) {
                try {
                    await removeStorageFiles([uploadedPath]);
                } catch (cleanupError) {
                    console.error(
                        "Falha ao limpar nova imagem após erro na actualização do paciente:",
                        cleanupError
                    );
                }
            }

            const message = error instanceof Error
                ? error.message
                : "Não foi possível actualizar os dados do paciente.";

            return response.status(400).json({ message });
        }
    }
}

export default new UpdatePatientsControllers();
