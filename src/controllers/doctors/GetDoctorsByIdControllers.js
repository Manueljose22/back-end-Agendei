"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DoctorsRepository_1 = require("../../repositories/doctors/DoctorsRepository");
const GetDoctorsByIdServices_1 = require("../../services/doctors/GetDoctorsByIdServices");
class GetDoctorsByIdControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
            const service = new GetDoctorsByIdServices_1.GetDoctorsByIdServices(doctorsRepository);
            const result = await service.execute(id);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetDoctorsByIdControllers;
