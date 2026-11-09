"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ListHospitalsService_1 = require("../../services/hospitals/ListHospitalsService");
const HospitalsRepository_1 = require("../../repositories/hospitals/HospitalsRepository");
class ListHospitalsControllers {
    async handle(request, response) {
        try {
            const hospitalsRepository = new HospitalsRepository_1.HospitalsRepository();
            const service = new ListHospitalsService_1.ListHospitalsService(hospitalsRepository);
            const result = await service.execute();
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ListHospitalsControllers;
