"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ListSpecialitiesService_1 = require("../../services/specialities/ListSpecialitiesService");
const SpecialityRepository_1 = require("../../repositories/specialities/SpecialityRepository");
class ListSpecialityControllers {
    async handle(request, response) {
        try {
            const specialityRepository = new SpecialityRepository_1.SpecialityRepository();
            const service = new ListSpecialitiesService_1.ListSpecialitiesService(specialityRepository);
            const result = await service.execute();
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ListSpecialityControllers;
