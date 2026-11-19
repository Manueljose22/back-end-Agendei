import { AppError } from "../../errors/AppError";
import { IServicesRepository, servicesRequest } from "../../repositories/services/IServicesRepository";






class CreateServiceServices {

    constructor(private iserviceRepository: IServicesRepository) { }

    async execute(data: servicesRequest): Promise<void | Error> {
        
        const service = await this.iserviceRepository.findByName(data.title);

        if (service) {
            throw new AppError('Já existe um registro com este nome!', 409);
        }

        if (!data.title) {
            throw new AppError('Preencha o campo nome!', 400);
        } else if (!data.specialtyId) {
            throw new AppError('Preencha o campo especialidade!', 400);
        }

        await this.iserviceRepository.save(data);

    }
}

export { CreateServiceServices };