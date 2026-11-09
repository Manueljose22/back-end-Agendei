"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppointmentsRepository_1 = require("../../repositories/appointments/AppointmentsRepository");
const AddAppointmentsServices_1 = require("../../services/appointments/AddAppointmentsServices");
const TimetablesRepository_1 = require("../../repositories/timetables/TimetablesRepository");
class AddAppointmentsControllers {
    async handle(request, response) {
        const { userId } = request;
        const { serviceId, doctorId, bookingDate, patientId, bookingHour } = request.body;
        const patient = patientId ?? userId;
        try {
            const appointmentsRepository = new AppointmentsRepository_1.AppointmentsRepository();
            const timetablesRepository = new TimetablesRepository_1.TimetablesRepository();
            const service = new AddAppointmentsServices_1.AddAppointmentsServices(appointmentsRepository, timetablesRepository);
            const result = await service.execute({ patientId: patient, serviceId, doctorId, bookingDate, bookingHour });
            return response.status(200).json({ message: 'Agendamento feito com sucesso.' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new AddAppointmentsControllers;
