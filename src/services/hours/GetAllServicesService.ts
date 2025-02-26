import { IServicesRepository, servicesSaved } from "../../repositorys/services/IServicesRepository";





class GetAllServicesService {

    constructor(private IServiceRepository: IServicesRepository) { }

    async execute(): Promise<servicesSaved[] | null> {

        const service = await this.IServiceRepository.findAll();
        return service;

    }
}

export { GetAllServicesService };