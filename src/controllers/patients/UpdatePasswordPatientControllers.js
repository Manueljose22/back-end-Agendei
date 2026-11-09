"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PatientsRepository_1 = require("../../repositories/patients/PatientsRepository");
const UpdatePasswordPatientServices_1 = require("../../services/patients/UpdatePasswordPatientServices");
class UpdatePasswordPatientControllers {
    async handle(request, response) {
        const { userId } = request;
        const { id } = request.params;
        const data = request.body;
        try {
            const patientsRepository = new PatientsRepository_1.PatientsRepository();
            const service = new UpdatePasswordPatientServices_1.UpdatePasswordPatientServices(patientsRepository);
            const result = await service.execute(id, userId, data);
            return response.json({ message: "Senha actualizada com sucesso." });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new UpdatePasswordPatientControllers;
