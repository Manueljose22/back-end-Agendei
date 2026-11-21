import { NextFunction, Request, Response } from "express";
import { doctorRequest } from "../../repositories/doctors/IDoctorsRepository";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { AddDoctorsServices } from "../../services/doctors/AddDoctorsServices";
import {
    uploadFilesWithPaths,
    removeStorageFiles
} from "../../middlewares/upload/uploadsFiles";

class AddDoctorsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        let uploadedPath: string | null = null;

        try {
            const data = request.body as doctorRequest;
            data.hospitalId = request.userId;
            data.password = data.password ?? null;

            if (request.file) {
                const [uploadedFile] = await uploadFilesWithPaths(request.file);
                data.photo = uploadedFile.url;
                uploadedPath = uploadedFile.path;
            }

            const service = new AddDoctorsServices(new DoctorsRepository());
            await service.execute(data);

            return response.status(201).json({ message: "Médico cadastrado com sucesso." });
        } catch (error: unknown) {
            if (uploadedPath) {
                try {
                    await removeStorageFiles([uploadedPath]);
                } catch (cleanupError) {
                    console.error("Falha ao limpar fotografia após erro no cadastro do médico:", cleanupError);
                }
            }

            return next(error);
        }
    }
}

export default new AddDoctorsControllers();
