"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServicesRepository_1 = require("../../repositories/services/ServicesRepository");
const GetAllServicesService_1 = require("../../services/services/GetAllServicesService");
class GetAllServicesController {
    async handle(request, response) {
        try {
            const serviceRepository = new ServicesRepository_1.ServicesRepository();
            const service = new GetAllServicesService_1.GetAllServicesService(serviceRepository);
            const result = await service.execute();
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetAllServicesController;
