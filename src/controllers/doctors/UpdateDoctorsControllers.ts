import { NextFunction, Request, Response } from "express";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { UpdateDoctor } from "../../repositories/doctors/IDoctorsRepository";
import { UpdateDoctorsServices } from "../../services/doctors/UpdateDoctorsServices";
import {
    getStoragePathFromPublicUrl,
    removeStorageFiles,
    uploadFilesWithPaths
} from "../../middlewares/upload/uploadsFiles";

class UpdateDoctorsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        let uploadedPath: string | null = null;

        try {
            const { id } = request.params;
            const data = request.body as UpdateDoctor;

            if (request.file) {
                const [uploadedFile] = await uploadFilesWithPaths(request.file);
                data.photo = uploadedFile.url;
                uploadedPath = uploadedFile.path;
            }

            const service = new UpdateDoctorsServices(new DoctorsRepository());
            const result = await service.execute(
                request.userId,
                id,
                data,
                request.userRole === "platform_admin"
            );

            if (uploadedPath) {
                const previousPath = getStoragePathFromPublicUrl(result.previousPhoto);

                if (previousPath && previousPath !== uploadedPath) {
                    try {
                        await removeStorageFiles([previousPath]);
                    } catch (cleanupError) {
                        console.error("Médico actualizado, mas não foi possível remover a fotografia anterior:", cleanupError);
                    }
                }
            }

            return response.status(200).json({ message: "Dados actualizados com sucesso." });
        } catch (error: unknown) {
            if (uploadedPath) {
                try {
                    await removeStorageFiles([uploadedPath]);
                } catch (cleanupError) {
                    console.error("Falha ao limpar nova fotografia após erro na actualização do médico:", cleanupError);
                }
            }

            return next(error);
        }
    }
}

export default new UpdateDoctorsControllers();
