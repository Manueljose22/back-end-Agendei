"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TimetablesRepository_1 = require("../../repositories/timetables/TimetablesRepository");
const UnblockDayService_1 = require("../../services/timetables/UnblockDayService");
class UnblockDayController {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const timetablesRepository = new TimetablesRepository_1.TimetablesRepository();
            const unblockDayService = new UnblockDayService_1.UnblockDayService(timetablesRepository);
            await unblockDayService.execute(id);
            return response.status(204).send();
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.default = new UnblockDayController;
