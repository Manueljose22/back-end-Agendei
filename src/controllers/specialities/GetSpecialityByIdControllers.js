"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetSpecialityByIdService_1 = require("../../services/specialities/GetSpecialityByIdService");
const SpecialityRepository_1 = require("../../repositories/specialities/SpecialityRepository");
class GetSpecialityByIdControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const specialityRepository = new SpecialityRepository_1.SpecialityRepository();
            const service = new GetSpecialityByIdService_1.GetSpecialityByIdService(specialityRepository);
            const result = await service.execute(id);
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetSpecialityByIdControllers;
