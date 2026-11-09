"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceToDoctorServices_1 = require("../../services/doctors/ServiceToDoctorServices");
const DoctorsRepository_1 = require("../../repositories/doctors/DoctorsRepository");
class ServiceToDoctorController {
    async handle(request, response) {
        const { serviceId, doctorId, price } = request.body;
        try {
            const doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
            const service = new ServiceToDoctorServices_1.ServiceToDoctorServices(doctorsRepository);
            await service.execute({ serviceId, doctorId, price });
            return response.status(200).json({ message: 'Serviço vinculado ao médico com sucesso!' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ServiceToDoctorController;
