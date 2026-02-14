import { IServicesRepository, servicesRequest,  } from "../../repositories/services/IServicesRepository";






class UpdateServiceServices {

    constructor(private iserviceRepository: IServicesRepository) { }

    async execute(id: string, data: Omit< servicesRequest, 'id'> ): Promise<void | Error> {

        const service = await this.iserviceRepository.findById(id);

        if (!service) {
            throw new Error('Serviço invalido!');
        }

        console.log(data);
        

        const updateData = {
            id: service.id,
            title: data.title ?? service.title,
            description: data.title ?? service.title,
            duraction: data.duraction ?? service.duraction,
            status: data.status ?? service.status,
            specialtyId: data.specialtyId ?? service.specialtyId,
            price: data.price ?? service.price
        }

        await this.iserviceRepository.update(id, updateData);
    }
}

export { UpdateServiceServices };