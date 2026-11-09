"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServicesRepository_1 = require("../../repositories/services/ServicesRepository");
const GetByIdServicesService_1 = require("../../services/services/GetByIdServicesService");
class GetByIdServicesController {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const serviceRepository = new ServicesRepository_1.ServicesRepository();
            const service = new GetByIdServicesService_1.GetByIdServicesService(serviceRepository);
            const result = await service.execute(id);
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetByIdServicesController;
