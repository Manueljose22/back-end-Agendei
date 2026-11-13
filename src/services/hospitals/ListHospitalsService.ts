import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class ListHospitalsService {
    constructor(private hospitalsRepository: IHospitalsRepository) {}

    async execute(hospitalId?: string, isPlatformAdmin = false): Promise<hospitalSave[]> {
        if (!hospitalId) {
            return await this.hospitalsRepository.findList(isPlatformAdmin);
        }

        const hospital = await this.hospitalsRepository.findById(hospitalId);

        if (!hospital) {
            throw new Error("Hospital não existe.");
        }

        return [hospital];
    }
}

export { ListHospitalsService };
