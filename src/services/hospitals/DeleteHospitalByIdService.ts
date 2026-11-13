import { IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class DeleteHospitalByIdService {
    constructor(private IHospitalsRepository: IHospitalsRepository) {}

    async execute(id: string): Promise<string[]> {
        const hospital = await this.IHospitalsRepository.findById(id);

        if (!hospital) {
            throw new Error("Hospital não existe.");
        }

        return await this.IHospitalsRepository.delete(id);
    }
}

export { DeleteHospitalByIdService };