import { doctorServices, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";



class GetDoctorServicesServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }

    async execute(id: string): Promise<doctorServices[] | null> {

        const doctor_Service = await this.IDoctorsRepository.findDoctorService(id);

        return doctor_Service;
    }
}

export { GetDoctorServicesServices };