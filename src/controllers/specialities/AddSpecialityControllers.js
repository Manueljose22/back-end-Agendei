"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AddSpecialityService_1 = require("../../services/specialities/AddSpecialityService");
const SpecialityRepository_1 = require("../../repositories/specialities/SpecialityRepository");
class AddSpecialityControllers {
    async handle(request, response) {
        const data = request.body;
        const { userId } = request;
        data.hospitalId = userId;
        try {
            const specialityRepository = new SpecialityRepository_1.SpecialityRepository();
            const service = new AddSpecialityService_1.AddSpecialityService(specialityRepository);
            const result = await service.execute(data);
            return response.status(201).json({ message: "Especialidade cadastrada com sucesso." });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new AddSpecialityControllers;
