import { IServicesRepository, servicesRequest,  } from "../../repositorys/services/IServicesRepository";






class UpdateServiceServices {

    constructor(private iserviceRepository: IServicesRepository) { }

    async execute(id: string, data: Omit< servicesRequest, 'id'> ): Promise<void | Error> {

        const service = await this.iserviceRepository.findById(id);

        if (!service) {
            throw new Error('Serviço invalido!');
        }

        const updateData = {
            id: service.id,
            titulo: data.title ?? service.title,
            description: data.title ?? service.title,
        }

        await this.iserviceRepository.update(id, updateData);
    }
}

export { UpdateServiceServices };