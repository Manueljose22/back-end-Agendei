"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DoctorsRepository_1 = require("../../repositories/doctors/DoctorsRepository");
const GetDoctorServicesServices_1 = require("../../services/doctors/GetDoctorServicesServices");
class GetDoctorServicesControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
            const service = new GetDoctorServicesServices_1.GetDoctorServicesServices(doctorsRepository);
            const result = await service.execute(id);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new GetDoctorServicesControllers;
