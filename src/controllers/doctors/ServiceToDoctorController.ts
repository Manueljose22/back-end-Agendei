import { Request, Response } from "express";
import { ServiceToDoctorServices } from "../../services/doctors/ServiceToDoctorServices";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";

class ServiceToDoctorController {
    async handle(request: Request, response: Response) {
        const { serviceId, doctorId, price } = request.body;
        try {
            const service = new ServiceToDoctorServices(new DoctorsRepository());
            await service.execute(
                request.userId,
                { serviceId, doctorId, price },
                request.userRole === "platform_admin"
            );
            return response.status(200).json({ message: "Serviço vinculado ao médico com sucesso!" });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível associar o serviço ao médico.";
            return response.status(400).json({ message });
        }
    }
}

export default new ServiceToDoctorController();
