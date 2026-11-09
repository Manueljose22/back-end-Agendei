"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServicesRepository_1 = require("../../repositories/services/ServicesRepository");
const DeleteServicesService_1 = require("../../services/services/DeleteServicesService");
class DeleteServicesController {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const serviceRepository = new ServicesRepository_1.ServicesRepository();
            const service = new DeleteServicesService_1.DeleteServicesService(serviceRepository);
            const result = await service.execute(id);
            return response.json({ message: 'Registro eliminado com sucesso!' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new DeleteServicesController;
