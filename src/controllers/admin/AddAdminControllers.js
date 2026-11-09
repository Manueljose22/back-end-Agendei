"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepository_1 = require("../../repositories/admin/AdminRepository");
const AddAdminServices_1 = require("../../services/admin/AddAdminServices");
class AddAdminControllers {
    async handle(request, response) {
        const data = request.body;
        try {
            const adminRepository = new AdminRepository_1.AdminRepository();
            const service = new AddAdminServices_1.AddAdminServices(adminRepository);
            const result = await service.execute(data);
            return response.status(201).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new AddAdminControllers;
