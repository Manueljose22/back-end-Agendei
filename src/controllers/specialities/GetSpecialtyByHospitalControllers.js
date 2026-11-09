"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpecialityRepository_1 = require("../../repositories/specialities/SpecialityRepository");
const GetSpecialtyByHospitalService_1 = require("../../services/specialities/GetSpecialtyByHospitalService");
class GetSpecialtyByHospitalControllers {
    async handle(request, response) {
        const { userId } = request;
        try {
            const specialityRepository = new SpecialityRepository_1.SpecialityRepository();
            const service = new GetSpecialtyByHospitalService_1.GetSpecialtyByHospitalService(specialityRepository);
            const result = await service.execute(userId);
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetSpecialtyByHospitalControllers;
