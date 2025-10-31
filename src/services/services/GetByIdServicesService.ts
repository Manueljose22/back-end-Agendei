import { IServicesRepository, servicesSaved } from "../../repositories/services/IServicesRepository";





class GetByIdServicesService {

    constructor(private IServiceRepository: IServicesRepository) { }

    async execute(id: string): Promise<servicesSaved | Error> {

        const service = await this.IServiceRepository.findById(id);

        if (!service) {
           throw new Error('Serviço invalido!');
        }
        
        return service;
    }
}

export { GetByIdServicesService };