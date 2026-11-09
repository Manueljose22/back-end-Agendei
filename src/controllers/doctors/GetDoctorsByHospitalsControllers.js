"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DoctorsRepository_1 = require("../../repositories/doctors/DoctorsRepository");
const GetDoctorsByHospitalsServices_1 = require("../../services/doctors/GetDoctorsByHospitalsServices");
class GetDoctorsByHospitalsControllers {
    async handle(request, response) {
        const { userId } = request;
        try {
            const doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
            const service = new GetDoctorsByHospitalsServices_1.GetDoctorsByHospitalsServices(doctorsRepository);
            const result = await service.execute(userId);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetDoctorsByHospitalsControllers;
