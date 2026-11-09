"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdminServices = void 0;
class UpdateAdminServices {
    adminRepository;
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async execute(id, data) {
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            throw new Error("Administrador não encontrado.");
        }
        const update = {};
        if (data.name !== undefined)
            update.name = data.name;
        if (data.email !== undefined)
            update.email = data.email;
        if (Object.keys(update).length === 0) {
            throw new Error("Indique pelo menos um campo para actualizar.");
        }
        if (update.email && update.email !== admin.email) {
            const existing = await this.adminRepository.findByEmail(update.email);
            if (existing)
                throw new Error("Este email já está associado a outro administrador.");
        }
        await this.adminRepository.update(id, update);
    }
}
exports.UpdateAdminServices = UpdateAdminServices;
