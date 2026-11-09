"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpecialityRepository_1 = require("../../repositories/specialities/SpecialityRepository");
const SearchSpecialitiesServices_1 = require("../../services/specialities/SearchSpecialitiesServices");
class SearchSpecialitiesControllers {
    async handle(request, response) {
        const { q } = request.query;
        try {
            if (typeof q !== 'string') {
                throw new Error("Query parameter 'q' must be a string.");
            }
            const specialityRepository = new SpecialityRepository_1.SpecialityRepository();
            const searchSpecialitiesServices = new SearchSpecialitiesServices_1.SearchSpecialitiesServices(specialityRepository);
            const specialities = await searchSpecialitiesServices.execute(q);
            return response.status(200).json(specialities);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new SearchSpecialitiesControllers;
