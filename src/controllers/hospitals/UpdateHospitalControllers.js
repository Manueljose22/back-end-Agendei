"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uploadsFiles_1 = require("../../middlewares/upload/uploadsFiles");
const UpdateHospitalService_1 = require("../../services/hospitals/UpdateHospitalService");
const HospitalsRepository_1 = require("../../repositories/hospitals/HospitalsRepository");
class UpdateHospitalControllers {
    async handle(request, response) {
        const { id } = request.params;
        const data = request.body;
        const images = request.files;
        try {
            const urls = await (0, uploadsFiles_1.uploadsFiles)(images);
            const hospitalsRepository = new HospitalsRepository_1.HospitalsRepository();
            const service = new UpdateHospitalService_1.UpdateHospitalService(hospitalsRepository);
            const result = await service.execute(id, data, urls);
            return response.json({ message: "Dados actualizados com sucesso." });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new UpdateHospitalControllers;
