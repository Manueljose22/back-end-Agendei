import { AppError } from "../../errors/AppError";
import { IServicesRepository, servicesRequest } from "../../repositories/services/IServicesRepository";

class UpdateServiceServices {
    constructor(private serviceRepository: IServicesRepository) {}

    async execute(id: string, hospitalId: string, data: Omit<servicesRequest, "id">): Promise<void> {
        const service = await this.serviceRepository.findById(id, hospitalId);

        if (!service) {
            throw new AppError("Serviço não encontrado.", 404);
        }

        const title = data.title?.trim() || service.title;

        if (title !== service.title) {
            const existingService = await this.serviceRepository.findByName(title);
            if (existingService && existingService.id !== id) {
                throw new AppError("Já existe um registro com este nome!", 409);
            }
        }

        const specialtyId = data.specialtyId ?? service.specialtyId;
        if (!specialtyId || !(await this.serviceRepository.specialtyBelongsToHospital(specialtyId, hospitalId))) {
            throw new AppError("A especialidade indicada não pertence a este hospital.", 403);
        }

        const updated = await this.serviceRepository.update(id, {
            title,
            description: data.description ?? service.description,
            duraction: data.duraction ?? service.duraction,
            status: data.status ?? service.status,
            specialtyId,
            price: data.price ?? service.price
        }, hospitalId);

        if (!updated) {
            throw new AppError("Serviço não encontrado ou sem permissão para o alterar.", 404);
        }
    }
}

export { UpdateServiceServices };
