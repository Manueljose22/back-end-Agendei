import { AppError } from "../../errors/AppError";
import { IServicesRepository, servicesRequest } from "../../repositories/services/IServicesRepository";

class UpdateServiceServices {
    constructor(private serviceRepository: IServicesRepository) {}

    async execute(id: string, data: Omit<servicesRequest, "id">): Promise<void> {
        const service = await this.serviceRepository.findById(id);

        if (!service) {
            throw new AppError("Serviço inválido.", 404);
        }

        const title = data.title?.trim() || service.title;

        if (title !== service.title) {
            const existingService = await this.serviceRepository.findByName(title);

            if (existingService && existingService.id !== id) {
                throw new AppError("Já existe um registro com este nome!", 409);
            }
        }

        await this.serviceRepository.update(id, {
            title,
            description: data.description ?? service.description,
            duraction: data.duraction ?? service.duraction,
            status: data.status ?? service.status,
            specialtyId: data.specialtyId ?? service.specialtyId,
            price: data.price ?? service.price
        });
    }
}

export { UpdateServiceServices };
