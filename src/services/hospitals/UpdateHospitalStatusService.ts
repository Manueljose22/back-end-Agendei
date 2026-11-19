import { AppError } from "../../errors/AppError";
import { HospitalStatus } from "@prisma/client";
import { IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class UpdateHospitalStatusService {
    constructor(private hospitalsRepository: IHospitalsRepository) {}

    async execute(id: string, status: HospitalStatus) {
        const hospital = await this.hospitalsRepository.findById(id);

        if (!hospital) {
            throw new AppError("Hospital não existe.", 404);
        }

        if (hospital.status === status) {
            return hospital;
        }

        return await this.hospitalsRepository.updateStatus(id, status);
    }
}

export { UpdateHospitalStatusService };
