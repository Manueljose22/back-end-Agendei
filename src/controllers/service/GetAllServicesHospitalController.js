"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServicesRepository_1 = require("../../repositories/services/ServicesRepository");
const GetAllServicesHospitalService_1 = require("../../services/services/GetAllServicesHospitalService");
class GetAllServicesHospitalController {
    async handle(request, response) {
        const { userId } = request;
        try {
            const repository = new ServicesRepository_1.ServicesRepository();
            const service = new GetAllServicesHospitalService_1.GetAllServicesHospitalService(repository);
            const result = await service.execute(userId);
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetAllServicesHospitalController;
