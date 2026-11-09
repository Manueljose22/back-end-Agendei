"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DoctorsRepository_1 = require("../../repositories/doctors/DoctorsRepository");
const SearchDoctorsServices_1 = require("../../services/doctors/SearchDoctorsServices");
class SearchDoctorsControllers {
    async handle(request, response) {
        const { q } = request.query;
        try {
            if (typeof q !== 'string') {
                throw new Error("Query parameter 'q' must be a string.");
            }
            const doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
            const searchDoctorsServices = new SearchDoctorsServices_1.SearchDoctorsServices(doctorsRepository);
            const doctors = await searchDoctorsServices.execute(q);
            return response.status(200).json(doctors);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new SearchDoctorsControllers;
