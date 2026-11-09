"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TimetablesRepository_1 = require("../../repositories/timetables/TimetablesRepository");
const UpdateAvailabilityService_1 = require("../../services/timetables/UpdateAvailabilityService");
class UpdateAvailabilityController {
    async handle(request, response) {
        const { id } = request.params;
        const { hourStart, hourEnd } = request.body;
        try {
            const timetablesRepository = new TimetablesRepository_1.TimetablesRepository();
            const updateAvailabilityService = new UpdateAvailabilityService_1.UpdateAvailabilityService(timetablesRepository);
            await updateAvailabilityService.execute(id, { hourStart, hourEnd });
            return response.status(204).send();
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.default = new UpdateAvailabilityController;
