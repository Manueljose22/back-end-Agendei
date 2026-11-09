"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PatientsRepository_1 = require("../../repositories/patients/PatientsRepository");
const SearchPatientsServices_1 = require("../../services/patients/SearchPatientsServices");
class SearchPatientsControllers {
    async handle(request, response) {
        const { q } = request.query;
        try {
            if (typeof q !== 'string') {
                throw new Error("Query parameter 'q' must be a string.");
            }
            const patientsRepository = new PatientsRepository_1.PatientsRepository();
            const searchPatientsServices = new SearchPatientsServices_1.SearchPatientsServices(patientsRepository);
            const patients = await searchPatientsServices.execute(q);
            return response.status(200).json(patients);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new SearchPatientsControllers;
