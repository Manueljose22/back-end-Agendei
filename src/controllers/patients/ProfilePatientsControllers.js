"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PatientsRepository_1 = require("../../repositories/patients/PatientsRepository");
const ProfilePatientsServices_1 = require("../../services/patients/ProfilePatientsServices");
class ProfilePatientsControllers {
    async handle(request, response) {
        const { userId } = request;
        try {
            const patientsRepository = new PatientsRepository_1.PatientsRepository();
            const service = new ProfilePatientsServices_1.ProfilePatientsServices(patientsRepository);
            const result = await service.execute(userId);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ProfilePatientsControllers;
