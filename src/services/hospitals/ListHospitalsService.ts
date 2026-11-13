import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class ListHospitalsService {
    constructor(private hospitalsRepository: IHospitalsRepository) {}

    async execute(hospitalId?: string): Promise<hospitalSave[]> {
        if (!hospitalId) {
            return await this.hospitalsRepository.findList();
        }

        const hospital = await this.hospitalsRepository.findById(hospitalId);

        if (!hospital) {
            throw new Error("Hospital não existe.");
        }

        return [hospital];
    }
}

export { ListHospitalsService };
