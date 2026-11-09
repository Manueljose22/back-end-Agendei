"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TimetablesRepository_1 = require("../../repositories/timetables/TimetablesRepository");
const UnbookHourService_1 = require("../../services/timetables/UnbookHourService");
class UnbookHourController {
    async handle(request, response) {
        const { timetableId } = request.params;
        try {
            const timetablesRepository = new TimetablesRepository_1.TimetablesRepository();
            const unbookHourService = new UnbookHourService_1.UnbookHourService(timetablesRepository);
            await unbookHourService.execute(timetableId);
            return response.status(204).send();
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.default = new UnbookHourController;
