import { Request, Response } from 'express';
import {
    getStoragePathFromPublicUrl,
    removeStorageFiles,
    uploadFilesWithPaths
} from '../../middlewares/upload/uploadsFiles';
import { UpdateHospitalService } from '../../services/hospitals/UpdateHospitalService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';

class UpdateHospitalControllers {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
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
            const service = new UpdateHospitalService(hospitalsRepository);

            let previousImageUrls: string[];

            try {
                previousImageUrls = await service.execute(
                    id,
                    data,
                    uploadedFiles.length > 0 ? imageUrls : undefined
                );
            } catch (error) {
                if (uploadedPaths.length > 0) {
                    try {
                        await removeStorageFiles(uploadedPaths);
                    } catch (cleanupError) {
                        console.error("Falha ao limpar novas imagens após erro na actualização do hospital:", cleanupError);
                    }
                }

                throw error;
            }

            const previousImagePaths = previousImageUrls
                .map(url => getStoragePathFromPublicUrl(url))
                .filter((path): path is string => path !== null);

            if (previousImagePaths.length > 0) {
                try {
                    await removeStorageFiles(previousImagePaths);
                } catch (cleanupError) {
                    console.error("Hospital actualizado, mas não foi possível remover algumas imagens antigas do Storage:", cleanupError);
                }
            }

            return response.json({
                message: "Dados actualizados com sucesso."
            });
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível actualizar o hospital.";

            return response.status(400).json({ message });
        }
    }
}

export default new UpdateHospitalControllers();