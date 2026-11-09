"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetPatientsByIdServices_1 = require("../../services/patients/GetPatientsByIdServices");
const PatientsRepository_1 = require("../../repositories/patients/PatientsRepository");
class GetPatientsByIdControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const patientsRepository = new PatientsRepository_1.PatientsRepository();
            const service = new GetPatientsByIdServices_1.GetPatientsByIdServices(patientsRepository);
            const result = await service.execute(id);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetPatientsByIdControllers;
