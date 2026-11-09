"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TimetablesRepository_1 = require("../../repositories/timetables/TimetablesRepository");
const CreateAvailabilityService_1 = require("../../services/timetables/CreateAvailabilityService");
class CreateAvailabilityController {
    async handle(request, response) {
        const { doctorId, date, hourStart, hourEnd } = request.body;
        const timetablesRepository = new TimetablesRepository_1.TimetablesRepository();
        const createAvailabilityService = new CreateAvailabilityService_1.CreateAvailabilityService(timetablesRepository);
        try {
            await createAvailabilityService.execute({ doctorId, date, hourStart, hourEnd });
            return response.status(201).send();
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.default = new CreateAvailabilityController;
