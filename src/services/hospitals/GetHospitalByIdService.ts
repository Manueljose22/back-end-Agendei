import { AppError } from "../../errors/AppError";
import { HospitalStatus } from "@prisma/client";
import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class GetHospitalByIdService {
    constructor(private hospitalsRepository: IHospitalsRepository) {}

    async execute(id: string, canViewSuspended = false): Promise<hospitalSave | null> {
        const hospital = await this.hospitalsRepository.findById(id);

        if (!hospital || (!canViewSuspended && hospital.status === HospitalStatus.SUSPENDED)) {
            throw new AppError("Hospital não existe ou não está disponível.", 404);
        }

        return hospital;
    }
}

export { GetHospitalByIdService };
