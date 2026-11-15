import { doctorSave, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";

class SearchDoctorsServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(query: string, hospitalId?: string, includeSuspended = false): Promise<doctorSave[]> {
        return this.doctorsRepository.findSearch(query, hospitalId, includeSuspended);
    }
}

export { SearchDoctorsServices };
