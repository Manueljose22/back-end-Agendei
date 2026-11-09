"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServicesRepository_1 = require("../../repositories/services/ServicesRepository");
const UpdateServiceServices_1 = require("../../services/services/UpdateServiceServices");
class UpdateServicesController {
    async handle(request, response) {
        const data = request.body;
        const { id } = request.params;
        try {
            const serviceRepository = new ServicesRepository_1.ServicesRepository();
            const service = new UpdateServiceServices_1.UpdateServiceServices(serviceRepository);
            const result = await service.execute(id, data);
            return response.json({ message: 'Registro actualizado com sucesso!' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new UpdateServicesController;
