"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServicesRepository_1 = require("../../repositories/services/ServicesRepository");
const CreateServiceServices_1 = require("../../services/services/CreateServiceServices");
class CreateServicesController {
    async handle(request, response) {
        const data = request.body;
        try {
            const servicesRepository = new ServicesRepository_1.ServicesRepository();
            const service = new CreateServiceServices_1.CreateServiceServices(servicesRepository);
            const result = await service.execute(data);
            return response.status(201).json({ message: "Serviço criado com sucesso!" });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new CreateServicesController;
