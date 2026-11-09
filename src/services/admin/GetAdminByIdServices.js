"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminByIdServices = void 0;
class GetAdminByIdServices {
    IAdminRepository;
    constructor(IAdminRepository) {
        this.IAdminRepository = IAdminRepository;
    }
    async execute(id) {
        const admin = await this.IAdminRepository.findById(id);
        if (!admin) {
            throw new Error('Não existe este usuário!');
        }
        return admin;
    }
}
exports.GetAdminByIdServices = GetAdminByIdServices;
