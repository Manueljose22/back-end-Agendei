import { HospitalStatus } from "@prisma/client";
import { IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class UpdateHospitalStatusService {
    constructor(private hospitalsRepository: IHospitalsRepository) {}

    async execute(id: string, status: HospitalStatus) {
        const hospital = await this.hospitalsRepository.findById(id);

        if (!hospital) {
            throw new Error("Hospital não existe.");
        }

        if (hospital.status === status) {
            return hospital;
        }

        return await this.hospitalsRepository.updateStatus(id, status);
    }
}

export { UpdateHospitalStatusService };
