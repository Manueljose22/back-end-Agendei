import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { HospitalsRepository } from "../../repositories/hospitals/HospitalsRepository";
import { SearchHospitalsServices } from "../../services/hospitals/SearchHospitalsServices";

class SearchHospitalsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { q } = request.query;

        try {
            if (typeof q !== 'string') {
                throw new AppError("O parâmetro 'q' deve ser um texto.", 400);
            }

            const hospitalsRepository = new HospitalsRepository();
            const searchHospitalsServices = new SearchHospitalsServices(hospitalsRepository);
            const hospitals = await searchHospitalsServices.execute(
                q,
                request.hospitalId,
                request.isPlatformAdmin
            );

            return response.status(200).json(hospitals);
        } catch (error: unknown) {
            return next(error);
        }
    }
}
export default new SearchHospitalsControllers();
