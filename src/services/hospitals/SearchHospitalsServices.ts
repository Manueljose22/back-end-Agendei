import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class SearchHospitalsServices {
    constructor(private hospitalsRepository: IHospitalsRepository) {}

    async execute(
        query: string,
        hospitalId?: string,
        isPlatformAdmin = false
    ): Promise<hospitalSave[] | null> {
        return await this.hospitalsRepository.findSearch(query, hospitalId, isPlatformAdmin);
    }
}

export { SearchHospitalsServices };
