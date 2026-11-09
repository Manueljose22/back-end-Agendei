"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DoctorsRepository_1 = require("../../repositories/doctors/DoctorsRepository");
const AddDoctorsServices_1 = require("../../services/doctors/AddDoctorsServices");
const uploadsFiles_1 = require("../../middlewares/upload/uploadsFiles");
class AddDoctorsControllers {
    async handle(request, response) {
        const data = request.body;
        const { userId } = request;
        data.hospitalId = userId;
        if (request.file) {
            data.photo = await (0, uploadsFiles_1.uploadsFiles)(request.file);
        }
        try {
            const doctorRepository = new DoctorsRepository_1.DoctorsRepository();
            const service = new AddDoctorsServices_1.AddDoctorsServices(doctorRepository);
            const result = await service.execute(data);
            return response.status(201).json({ message: 'Douctor cadastrado com sucesso! ' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new AddDoctorsControllers;
