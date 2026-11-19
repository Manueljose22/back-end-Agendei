import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { ServiceToDoctorServices } from "../../services/doctors/ServiceToDoctorServices";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";

class ServiceToDoctorController {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { serviceId, doctorId, price, durationMinutes } = request.body;
        try {
            const service = new ServiceToDoctorServices(new DoctorsRepository());
            await service.execute(
                request.userId,
                { serviceId, doctorId, price, durationMinutes },
                request.userRole === "platform_admin"
            );
            return response.status(200).json({ message: "Serviço vinculado ao médico com sucesso!" });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new ServiceToDoctorController();
