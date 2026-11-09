import { Request, Response } from "express";
import { doctorRequest } from "../../repositories/doctors/IDoctorsRepository";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { AddDoctorsServices } from "../../services/doctors/AddDoctorsServices";
import { uploadsFiles } from "../../middlewares/upload/uploadsFiles";

class AddDoctorsControllers {
    async handle(request: Request, response: Response) {
        try {
            const data = request.body as doctorRequest;
            const { userId } = request;

            data.hospitalId = userId;

            if (request.file) {
                data.photo = await uploadsFiles(request.file) as string;
            }

            const doctorRepository = new DoctorsRepository();
            const service = new AddDoctorsServices(doctorRepository);

            await service.execute(data);

            return response.status(201).json({ message: "Médico cadastrado com sucesso." });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível cadastrar o médico.";
            return response.status(400).json({ message });
        }
    }
}

export default new AddDoctorsControllers();
