"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TimetablesRepository_1 = require("../../repositories/timetables/TimetablesRepository");
const BookHourService_1 = require("../../services/timetables/BookHourService");
class BookHourController {
    async handle(request, response) {
        const { timetableId } = request.params;
        const timetablesRepository = new TimetablesRepository_1.TimetablesRepository();
        const bookHourService = new BookHourService_1.BookHourService(timetablesRepository);
        try {
            await bookHourService.execute(timetableId);
            return response.status(204).send();
        }
        catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
exports.default = new BookHourController;
