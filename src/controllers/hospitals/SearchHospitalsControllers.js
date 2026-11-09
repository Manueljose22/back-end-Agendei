"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HospitalsRepository_1 = require("../../repositories/hospitals/HospitalsRepository");
const SearchHospitalsServices_1 = require("../../services/hospitals/SearchHospitalsServices");
class SearchHospitalsControllers {
    async handle(request, response) {
        const { q } = request.query;
        try {
            if (typeof q !== 'string') {
                throw new Error("Query parameter 'q' must be a string.");
            }
            const hospitalsRepository = new HospitalsRepository_1.HospitalsRepository();
            const searchHospitalsServices = new SearchHospitalsServices_1.SearchHospitalsServices(hospitalsRepository);
            const hospitals = await searchHospitalsServices.execute(q);
            return response.status(200).json(hospitals);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new SearchHospitalsControllers;
