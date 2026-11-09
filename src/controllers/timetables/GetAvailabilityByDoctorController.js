"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TimetablesRepository_1 = require("../../repositories/timetables/TimetablesRepository");
const GetAvailabilityByDoctorService_1 = require("../../services/timetables/GetAvailabilityByDoctorService");
class GetAvailabilityByDoctorController {
    async handle(request, response) {
        const { doctorId } = request.params;
        try {
            const timetablesRepository = new TimetablesRepository_1.TimetablesRepository();
            const getAvailabilityByDoctorService = new GetAvailabilityByDoctorService_1.GetAvailabilityByDoctorService(timetablesRepository);
            const availabilities = await getAvailabilityByDoctorService.execute(doctorId);
            return response.json(availabilities);
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.default = new GetAvailabilityByDoctorController;
