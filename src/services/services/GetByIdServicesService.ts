import { AppError } from "../../errors/AppError";
import { IServicesRepository, servicesSaved } from "../../repositories/services/IServicesRepository";





class GetByIdServicesService {

    constructor(private IServiceRepository: IServicesRepository) { }

    async execute(id: string): Promise<servicesSaved | Error> {

        const service = await this.IServiceRepository.findById(id);

        if (!service) {
           throw new AppError('Serviço invalido!', 404);
        }
        
        return service;
    }
}

export { GetByIdServicesService };