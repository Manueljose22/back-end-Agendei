"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DoctorsRepository_1 = require("../../repositories/doctors/DoctorsRepository");
const ListDoctorsServices_1 = require("../../services/doctors/ListDoctorsServices");
class ListDoctorController {
    async handle(request, response) {
        try {
            const doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
            const service = new ListDoctorsServices_1.ListDoctorsServices(doctorsRepository);
            const result = await service.execute();
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ListDoctorController;
