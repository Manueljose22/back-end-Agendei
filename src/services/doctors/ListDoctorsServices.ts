import { doctorSave, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";

class ListDoctorsServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(hospitalId?: string, includeSuspended = false): Promise<doctorSave[]> {
        return this.doctorsRepository.findAll(hospitalId, includeSuspended);
    }
}

export { ListDoctorsServices };
