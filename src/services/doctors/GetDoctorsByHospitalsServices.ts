import { doctorSave, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";

class GetDoctorsByHospitalsServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(idHospital: string): Promise<doctorSave[]> {
        return this.doctorsRepository.findAllByHospital(idHospital, true);
    }
}

export { GetDoctorsByHospitalsServices };
