import { AppError } from "../../errors/AppError";
import { adminUpdate, IAdminRepository } from "../../repositories/admin/IAdminRepository";

class UpdateAdminServices {
    constructor(private readonly adminRepository: IAdminRepository) {}

    async execute(id: string, data: adminUpdate): Promise<void> {
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            throw new AppError("Administrador não encontrado.", 404);
        }

        const update: adminUpdate = {};
        if (data.name !== undefined) update.name = data.name;
        if (data.email !== undefined) update.email = data.email;

        if (Object.keys(update).length === 0) {
            throw new AppError("Indique pelo menos um campo para actualizar.", 400);
        }

        if (update.email && update.email !== admin.email) {
            const existing = await this.adminRepository.findByEmail(update.email);
            if (existing) throw new AppError("Este email já está associado a outro administrador.", 409);
        }

        await this.adminRepository.update(id, update);
    }
}

export { UpdateAdminServices };
