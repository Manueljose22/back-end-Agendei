"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAdminServices = void 0;
class ListAdminServices {
    IAdminRepository;
    constructor(IAdminRepository) {
        this.IAdminRepository = IAdminRepository;
    }
    async execute(search) {
        const admins = await this.IAdminRepository.findAll(search);
        return admins;
    }
}
exports.ListAdminServices = ListAdminServices;
