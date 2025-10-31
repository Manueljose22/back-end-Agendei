import { IServicesRepository, servicesRequest } from "../../repositories/services/IServicesRepository";






class CreateServiceServices {

    constructor(private iserviceRepository: IServicesRepository) { }

    async execute(data: servicesRequest): Promise<void | Error> {

        const service = await this.iserviceRepository.findByName(data.title);

        if (service) {
            throw new Error('Já existe um registro com este nome!');
        }

        if (!data.title ) {
            throw new Error('Preecha todos os campos por favor!')
        }

        const dataSave = await this.iserviceRepository.save(data);

    }
}

export { CreateServiceServices };