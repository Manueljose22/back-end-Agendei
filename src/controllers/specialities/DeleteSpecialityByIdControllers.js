"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeleteSpecialityByIdService_1 = require("../../services/specialities/DeleteSpecialityByIdService");
const SpecialityRepository_1 = require("../../repositories/specialities/SpecialityRepository");
class DeleteSpecialityByIdControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const specialityRepository = new SpecialityRepository_1.SpecialityRepository();
            const service = new DeleteSpecialityByIdService_1.DeleteSpecialityByIdService(specialityRepository);
            const result = await service.execute(id);
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new DeleteSpecialityByIdControllers;
