"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PatientsRepository_1 = require("../../repositories/patients/PatientsRepository");
const UpdatePatientsServices_1 = require("../../services/patients/UpdatePatientsServices");
const uploadsFiles_1 = require("../../middlewares/upload/uploadsFiles");
class UpdatePatientsControllers {
    async handle(request, response) {
        const { id } = request.params;
        const data = request.body;
        console.log(data);
        const image = request.file;
        try {
            data.photo = await (0, uploadsFiles_1.uploadsFiles)(image);
            const patientsRepository = new PatientsRepository_1.PatientsRepository();
            const service = new UpdatePatientsServices_1.UpdatePatientsServices(patientsRepository);
            const result = await service.execute(id, data);
            return response.json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new UpdatePatientsControllers;
