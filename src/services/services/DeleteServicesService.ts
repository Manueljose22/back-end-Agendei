import { AppError } from "../../errors/AppError";
import { IServicesRepository } from "../../repositories/services/IServicesRepository";

class DeleteServicesService {
    constructor(private serviceRepository: IServicesRepository) {}

    async execute(id: string, hospitalId: string): Promise<void> {
        const deleted = await this.serviceRepository.delete(id, hospitalId);
        if (!deleted) {
            throw new AppError("Serviço não encontrado ou sem permissão para o eliminar.", 404);
        }
    }
}

export { DeleteServicesService };
