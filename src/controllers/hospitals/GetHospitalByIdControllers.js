"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetHospitalByIdService_1 = require("../../services/hospitals/GetHospitalByIdService");
const HospitalsRepository_1 = require("../../repositories/hospitals/HospitalsRepository");
class GetHospitalByIdControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const hospitalsRepository = new HospitalsRepository_1.HospitalsRepository();
            const service = new GetHospitalByIdService_1.GetHospitalByIdService(hospitalsRepository);
            const result = await service.execute(id);
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetHospitalByIdControllers;
