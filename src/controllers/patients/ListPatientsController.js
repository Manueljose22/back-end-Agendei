"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ListPatientsServices_1 = require("../../services/patients/ListPatientsServices");
const PatientsRepository_1 = require("../../repositories/patients/PatientsRepository");
class ListPatientsController {
    async handle(request, response) {
        const { search } = request.query;
        try {
            const patientsRepository = new PatientsRepository_1.PatientsRepository();
            const service = new ListPatientsServices_1.ListPatientsServices(patientsRepository);
            const result = await service.execute(search);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ListPatientsController;
