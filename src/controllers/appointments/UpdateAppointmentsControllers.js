"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppointmentsRepository_1 = require("../../repositories/appointments/AppointmentsRepository");
const UpdateAppointmentsServices_1 = require("../../services/appointments/UpdateAppointmentsServices");
class UpdateAppointmentsControllers {
    async handle(request, response) {
        const { id } = request.params;
        const { bookingDate, bookingHour, serviceId } = request.body;
        try {
            const appointmentsRepository = new AppointmentsRepository_1.AppointmentsRepository();
            const service = new UpdateAppointmentsServices_1.UpdateAppointmentsServices(appointmentsRepository);
            const result = await service.execute(id, { bookingDate, bookingHour, serviceId });
            return response.status(200).json({ message: 'Agendamento actualizado com sucesso..' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new UpdateAppointmentsControllers;
