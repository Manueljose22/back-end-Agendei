"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepository_1 = require("../../repositories/admin/AdminRepository");
const GetAdminByIdServices_1 = require("../../services/admin/GetAdminByIdServices");
class GetAdminByIdControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const adminRepository = new AdminRepository_1.AdminRepository();
            const service = new GetAdminByIdServices_1.GetAdminByIdServices(adminRepository);
            const result = await service.execute(id);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetAdminByIdControllers;
