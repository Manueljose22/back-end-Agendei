"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateSpecialityService_1 = require("../../services/specialities/UpdateSpecialityService");
const SpecialityRepository_1 = require("../../repositories/specialities/SpecialityRepository");
class UpdateSpecialityControllers {
    async handle(request, response) {
        const { id } = request.params;
        const data = request.body;
        try {
            const specialityRepository = new SpecialityRepository_1.SpecialityRepository();
            const service = new UpdateSpecialityService_1.UpdateSpecialityService(specialityRepository);
            const result = await service.execute(id, data);
            return response.json({ message: "Dados actualizados com sucesso." });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new UpdateSpecialityControllers;
