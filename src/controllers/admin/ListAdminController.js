"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepository_1 = require("../../repositories/admin/AdminRepository");
const ListAdminServices_1 = require("../../services/admin/ListAdminServices");
class ListAdminController {
    async handle(request, response) {
        const { search } = request.query;
        try {
            const adminRepository = new AdminRepository_1.AdminRepository();
            const service = new ListAdminServices_1.ListAdminServices(adminRepository);
            const result = await service.execute(search);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ListAdminController;
