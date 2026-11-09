"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepository_1 = require("../../repositories/admin/AdminRepository");
const UpdateAdminServices_1 = require("../../services/admin/UpdateAdminServices");
class UpdateAdminControllers {
    async handle(request, response) {
        const { id } = request.params;
        const data = request.body;
        try {
            const adminRepository = new AdminRepository_1.AdminRepository();
            const service = new UpdateAdminServices_1.UpdateAdminServices(adminRepository);
            const result = await service.execute(id, data);
            return response.json({ message: 'Dados actualizados com sucesso.' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new UpdateAdminControllers;
