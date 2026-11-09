"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TimetablesRepository_1 = require("../../repositories/timetables/TimetablesRepository");
const DeleteAvailabilityService_1 = require("../../services/timetables/DeleteAvailabilityService");
class DeleteAvailabilityController {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const timetablesRepository = new TimetablesRepository_1.TimetablesRepository();
            const deleteAvailabilityService = new DeleteAvailabilityService_1.DeleteAvailabilityService(timetablesRepository);
            await deleteAvailabilityService.execute(id);
            return response.status(204).send();
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.default = new DeleteAvailabilityController;
