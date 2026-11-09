"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileAdminServices = void 0;
class ProfileAdminServices {
    IAdminRepository;
    constructor(IAdminRepository) {
        this.IAdminRepository = IAdminRepository;
    }
    async execute(userId) {
        const admin = await this.IAdminRepository.findById(userId);
        // admin.password = ' ';
        return admin;
    }
}
exports.ProfileAdminServices = ProfileAdminServices;
