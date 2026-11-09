"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppointmentsRepository_1 = require("../../repositories/appointments/AppointmentsRepository");
const CancelAppointmentsServices_1 = require("../../services/appointments/CancelAppointmentsServices");
const TimetablesRepository_1 = require("../../repositories/timetables/TimetablesRepository");
class CancelAppointmentsControllers {
    async handle(request, response) {
        const { userId } = request;
        const { id } = request.params;
        try {
            const appointmentsRepository = new AppointmentsRepository_1.AppointmentsRepository();
            const timetablesRepository = new TimetablesRepository_1.TimetablesRepository();
            const service = new CancelAppointmentsServices_1.CancelAppointmentsServices(appointmentsRepository, timetablesRepository);
            const result = await service.execute(id, userId);
            return response.status(200).json({ message: 'Agendamento cancelado com sucesso.' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new CancelAppointmentsControllers;
