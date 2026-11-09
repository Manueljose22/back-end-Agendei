"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepository_1 = require("../../repositories/admin/AdminRepository");
const DeleteAdminServices_1 = require("../../services/admin/DeleteAdminServices");
class DeleteAdminControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const adminRepository = new AdminRepository_1.AdminRepository();
            const service = new DeleteAdminServices_1.DeleteAdminServices(adminRepository);
            const result = await service.execute(id);
            return response.status(200).json({ message: 'Registro excluído com sucesso.' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new DeleteAdminControllers;
