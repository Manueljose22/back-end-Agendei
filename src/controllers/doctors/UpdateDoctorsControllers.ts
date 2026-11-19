import { NextFunction, Request, Response } from "express";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { UpdateDoctor } from "../../repositories/doctors/IDoctorsRepository";
import { UpdateDoctorsServices } from "../../services/doctors/UpdateDoctorsServices";

class UpdateDoctorsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;
            const data = request.body as UpdateDoctor;
            const service = new UpdateDoctorsServices(new DoctorsRepository());
            await service.execute(request.userId, id, data, request.userRole === "platform_admin");
            return response.status(200).json({ message: "Dados actualizados com sucesso." });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new UpdateDoctorsControllers();
