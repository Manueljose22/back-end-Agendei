import { NextFunction, Request, Response } from 'express';
import { AppError } from "../../errors/AppError";
import {
    getStoragePathFromPublicUrl,
    removeStorageFiles
} from '../../middlewares/upload/uploadsFiles';
import { DeleteHospitalByIdService } from '../../services/hospitals/DeleteHospitalByIdService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';

class DeleteHospitalByIdControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        try {
            const hospitalsRepository = new HospitalsRepository();
            const service = new DeleteHospitalByIdService(hospitalsRepository);
            const imageUrls = await service.execute(id);

            const imagePaths = imageUrls
                .map(url => getStoragePathFromPublicUrl(url))
                .filter((path): path is string => path !== null);

            if (imagePaths.length > 0) {
                try {
                    await removeStorageFiles(imagePaths);
                } catch (cleanupError) {
                    console.error("Hospital eliminado, mas não foi possível remover algumas imagens do Storage:", cleanupError);
                }
            }

            return response.json({
                message: "Hospital eliminado com sucesso."
            });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new DeleteHospitalByIdControllers();