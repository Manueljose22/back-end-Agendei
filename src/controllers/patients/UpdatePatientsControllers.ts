import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { patientsProfileUpdate } from "../../repositories/patients/IPatientsRepository";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { UpdatePatientsServices } from "../../services/patients/UpdatePatientsServices";
import {
    uploadFilesWithPaths,
    removeStorageFiles,
    getStoragePathFromPublicUrl
} from "../../middlewares/upload/uploadsFiles";

class UpdatePatientsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
        let uploadedPath: string | null = null;

        if (request.userRole === "patient" && request.userId !== id) {
            return next(new AppError("Paciente não encontrado.", 404));
        }

        try {
            const data = request.body as patientsProfileUpdate;
            const rawDateBirth: unknown = request.body.dateBirth;

            // Campos multipart chegam como strings; converter a data antes do Prisma.
            // Se vier vazia, omitir o campo para preservar a data já guardada.
            if (typeof rawDateBirth === "string") {
                if (rawDateBirth.trim() === "") {
                    delete data.dateBirth;
                } else {
                    const parsedDate = new Date(rawDateBirth);
                    if (Number.isNaN(parsedDate.getTime())) {
                        throw new AppError(
                            "Data de nascimento inválida. Use o formato AAAA-MM-DD.",
                            400
                        );
                    }
                    data.dateBirth = parsedDate;
                }
            }

            if (request.file) {
                const [uploadedFile] = await uploadFilesWithPaths(request.file);
                data.photo = uploadedFile.url;
                uploadedPath = uploadedFile.path;
            }

            const repository = new PatientsRepository();
            const service = new UpdatePatientsServices(repository);
            const result = await service.execute(
                id,
                request.userId,
                request.userRole === "platform_admin",
                data
            );

            if (uploadedPath) {
                const previousPath = getStoragePathFromPublicUrl(result.previousPhoto);
                if (previousPath && previousPath !== uploadedPath) {
                    try {
                        await removeStorageFiles([previousPath]);
                    } catch (cleanupError) {
                        console.error("Falha ao remover a fotografia anterior do paciente:", cleanupError);
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
                    console.error("Falha ao limpar nova imagem após erro na actualização do paciente:", cleanupError);
                }
            }

            return next(error);
        }
    }
}

export default new UpdatePatientsControllers();
