import { HospitalStatus } from "@prisma/client";
import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class GetHospitalByIdService {
    constructor(private hospitalsRepository: IHospitalsRepository) {}

    async execute(id: string, canViewSuspended = false): Promise<hospitalSave | null> {
        const hospital = await this.hospitalsRepository.findById(id);

        if (!hospital || (!canViewSuspended && hospital.status === HospitalStatus.SUSPENDED)) {
            throw new Error("Hospital não existe ou não está disponível.");
        }

        return hospital;
    }
}

export { GetHospitalByIdService };
