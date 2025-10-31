import { IServicesRepository} from "../../repositories/services/IServicesRepository";





class DeleteServicesService {

    constructor(private IServiceRepository: IServicesRepository) { }

    async execute(id: string): Promise<void | Error> {

        const service = await this.IServiceRepository.findById(id);

        if (!service) {
           throw new Error('Serviço invalido!'); 
        }
        
        await this.IServiceRepository.delete(id)
    }
}

export { DeleteServicesService };