import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { doctorRequest } from "../../repositories/doctors/IDoctorsRepository";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { AddDoctorsServices } from "../../services/doctors/AddDoctorsServices";
import { uploadsFiles } from "../../middlewares/upload/uploadsFiles";

class AddDoctorsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const data = request.body as doctorRequest;
            data.hospitalId = request.userId;
            data.password = data.password ?? null;

            if (request.file) data.photo = await uploadsFiles(request.file) as string;

            const service = new AddDoctorsServices(new DoctorsRepository());
            await service.execute(data);

            return response.status(201).json({ message: "Médico cadastrado com sucesso." });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new AddDoctorsControllers();
