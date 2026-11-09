"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TimetablesRepository_1 = require("../../repositories/timetables/TimetablesRepository");
const BlockDayService_1 = require("../../services/timetables/BlockDayService");
class BlockDayController {
    async handle(request, response) {
        const { id } = request.params;
        const timetablesRepository = new TimetablesRepository_1.TimetablesRepository();
        const blockDayService = new BlockDayService_1.BlockDayService(timetablesRepository);
        try {
            await blockDayService.execute(id);
            return response.status(204).send();
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.default = new BlockDayController;
;
