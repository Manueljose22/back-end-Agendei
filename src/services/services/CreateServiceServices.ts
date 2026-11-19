import { AppError } from "../../errors/AppError";
import { IServicesRepository, servicesRequest } from "../../repositories/services/IServicesRepository";

class CreateServiceServices {
    constructor(private serviceRepository: IServicesRepository) {}

    async execute(data: servicesRequest): Promise<void> {
        const title = data.title?.trim();

        if (!title) {
            throw new AppError("Preencha o campo nome!", 400);
        }

        if (!data.specialtyId) {
            throw new AppError("Preencha o campo especialidade!", 400);
        }

        const service = await this.serviceRepository.findByName(title);

        if (service) {
            throw new AppError("Já existe um registro com este nome!", 409);
        }

        await this.serviceRepository.save({ ...data, title });
    }
}

export { CreateServiceServices };
