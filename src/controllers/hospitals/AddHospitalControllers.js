"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AddHospitalService_1 = require("../../services/hospitals/AddHospitalService");
const HospitalsRepository_1 = require("../../repositories/hospitals/HospitalsRepository");
class AddHospitalControllers {
    async handle(request, response) {
        const data = request.body;
        // const images = request.files as Express.Multer.File[]
        try {
            // const urls = await uploadsFiles(images)
            const hospitalsRepository = new HospitalsRepository_1.HospitalsRepository();
            const service = new AddHospitalService_1.AddHospitalService(hospitalsRepository);
            const result = await service.execute(data);
            return response.json({ message: "Hospital cadastrado com sucesso." });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new AddHospitalControllers;
