"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeleteHospitalByIdService_1 = require("../../services/hospitals/DeleteHospitalByIdService");
const HospitalsRepository_1 = require("../../repositories/hospitals/HospitalsRepository");
class DeleteHospitalByIdControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const hospitalsRepository = new HospitalsRepository_1.HospitalsRepository();
            const service = new DeleteHospitalByIdService_1.DeleteHospitalByIdService(hospitalsRepository);
            const result = await service.execute(id);
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new DeleteHospitalByIdControllers;
