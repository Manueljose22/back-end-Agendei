"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PatientsRepository_1 = require("../../repositories/patients/PatientsRepository");
const DeletePatientsServices_1 = require("../../services/patients/DeletePatientsServices");
class DeletePatientsControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const patientsRepository = new PatientsRepository_1.PatientsRepository();
            const service = new DeletePatientsServices_1.DeletePatientsServices(patientsRepository);
            const result = await service.execute(id);
            return response.status(200).json({ message: 'Registro excluído com sucesso.' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new DeletePatientsControllers;
