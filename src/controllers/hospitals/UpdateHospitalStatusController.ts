import { HospitalStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { HospitalsRepository } from "../../repositories/hospitals/HospitalsRepository";
import { UpdateHospitalStatusService } from "../../services/hospitals/UpdateHospitalStatusService";

class UpdateHospitalStatusController {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
        const { status } = request.body as { status?: unknown };

        if (status !== HospitalStatus.ACTIVE && status !== HospitalStatus.SUSPENDED) {
            return next(new AppError("Estado inválido. Utilize ACTIVE ou SUSPENDED.", 400));
        }

        try {
            const repository = new HospitalsRepository();
            const service = new UpdateHospitalStatusService(repository);
            const hospital = await service.execute(id, status);

            return response.status(200).json({
                message: status === HospitalStatus.SUSPENDED
                    ? "Hospital suspenso com sucesso."
                    : "Hospital reactivado com sucesso.",
                hospital
            });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new UpdateHospitalStatusController();
