"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AddPatientsServices_1 = require("../../services/patients/AddPatientsServices");
const PatientsRepository_1 = require("../../repositories/patients/PatientsRepository");
class AddPatientsControllers {
    async handle(request, response) {
        const data = request.body;
        try {
            const patientsRepository = new PatientsRepository_1.PatientsRepository();
            const service = new AddPatientsServices_1.AddPatientsServices(patientsRepository);
            const result = await service.execute(data);
            return response.status(201).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new AddPatientsControllers;
