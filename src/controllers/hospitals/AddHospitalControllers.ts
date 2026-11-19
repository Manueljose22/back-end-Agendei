import { NextFunction, Request, Response } from 'express';
import { AppError } from "../../errors/AppError";
import {
    removeStorageFiles,
    uploadFilesWithPaths
} from '../../middlewares/upload/uploadsFiles';
import { AddHospitalService } from '../../services/hospitals/AddHospitalService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';

class AddHospitalControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const data = request.body;
        const images = request.files as Express.Multer.File[] | undefined;
        let uploadedPaths: string[] = [];

        try {
            const uploadedFiles = images?.length
                ? await uploadFilesWithPaths(images)
                : [];

            uploadedPaths = uploadedFiles.map(file => file.path);

            const imageUrls = uploadedFiles.map(file => file.url);
            const hospitalsRepository = new HospitalsRepository();
            const service = new AddHospitalService(hospitalsRepository);

            await service.execute(data, imageUrls);

            return response.status(201).json({
                message: "Hospital cadastrado com sucesso."
            });
        } catch (error: unknown) {
            if (uploadedPaths.length > 0) {
                try {
                    await removeStorageFiles(uploadedPaths);
                } catch (cleanupError) {
                    console.error("Falha ao limpar imagens após erro no cadastro do hospital:", cleanupError);
                }
            }

            const message = error instanceof Error
                ? error.message
                : "Não foi possível cadastrar o hospital.";

            return response.status(400).json({ message });
        }
    }
}

export default new AddHospitalControllers();