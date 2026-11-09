"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepository_1 = require("../../repositories/admin/AdminRepository");
const ProfileAdminServices_1 = require("../../services/admin/ProfileAdminServices");
class ProfileAdminControllers {
    async handle(request, response) {
        const { userId } = request;
        try {
            const adminRepository = new AdminRepository_1.AdminRepository();
            const service = new ProfileAdminServices_1.ProfileAdminServices(adminRepository);
            const result = await service.execute(userId);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ProfileAdminControllers;
