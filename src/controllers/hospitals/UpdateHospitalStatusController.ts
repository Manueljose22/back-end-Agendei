import { HospitalStatus } from "@prisma/client";
import { Request, Response } from "express";
import { HospitalsRepository } from "../../repositories/hospitals/HospitalsRepository";
import { UpdateHospitalStatusService } from "../../services/hospitals/UpdateHospitalStatusService";

class UpdateHospitalStatusController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
        const { status } = request.body as { status?: unknown };

        if (status !== HospitalStatus.ACTIVE && status !== HospitalStatus.SUSPENDED) {
            return response.status(400).json({
                message: "Estado inválido. Utilize ACTIVE ou SUSPENDED."
            });
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
            const message = error instanceof Error
                ? error.message
                : "Não foi possível actualizar o estado do hospital.";

            return response.status(404).json({ message });
        }
    }
}

export default new UpdateHospitalStatusController();
