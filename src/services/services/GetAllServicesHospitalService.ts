import { IServicesRepository, servicesSaved } from "../../repositories/services/IServicesRepository";





class GetAllServicesHospitalService {

    constructor(private IServiceRepository: IServicesRepository) { }

    async execute(hospitalId: string): Promise<servicesSaved[] | null> {

        const services = await this.IServiceRepository.findAllHospital(hospitalId);
        return services;

    }
}

export { GetAllServicesHospitalService };