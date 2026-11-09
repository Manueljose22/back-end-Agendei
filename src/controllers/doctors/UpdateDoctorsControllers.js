"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DoctorsRepository_1 = require("../../repositories/doctors/DoctorsRepository");
const UpdateDoctorsServices_1 = require("../../services/doctors/UpdateDoctorsServices");
class UpdateDoctorsControllers {
    async handle(request, response) {
        const { id } = request.params;
        const data = request.body;
        const { userId } = request;
        try {
            const doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
            const service = new UpdateDoctorsServices_1.UpdateDoctorsServices(doctorsRepository);
            const result = await service.execute(userId, id, data);
            return response.json({ message: 'Dados actualizados com sucesso.' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new UpdateDoctorsControllers;
