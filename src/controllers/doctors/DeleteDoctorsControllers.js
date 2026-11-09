"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DoctorsRepository_1 = require("../../repositories/doctors/DoctorsRepository");
const DeleteDoctorsServices_1 = require("../../services/doctors/DeleteDoctorsServices");
class DeleteDoctorsControllers {
    async handle(request, response) {
        const { id } = request.params;
        const { userId } = request;
        try {
            const doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
            const service = new DeleteDoctorsServices_1.DeleteDoctorsServices(doctorsRepository);
            const result = await service.execute(userId, id);
            return response.status(200).json({ message: 'Registro excluído com sucesso.' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new DeleteDoctorsControllers;
