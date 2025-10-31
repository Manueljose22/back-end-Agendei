import { IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";



class ServiceToDoctorServices {

    constructor(private IDoctorRepository: IDoctorsRepository) { }

    async execute({serviceId, doctorId, price}: {serviceId: string, doctorId: string, price: number}): Promise<Error | void> {
        await this.IDoctorRepository.serviceToDoctor({serviceId, doctorId, price});
    }
}

export { ServiceToDoctorServices };