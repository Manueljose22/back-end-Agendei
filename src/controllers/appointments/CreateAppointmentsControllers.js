"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppointmentsRepository_1 = require("../../repositories/appointments/AppointmentsRepository");
const CreateAppointmentsServices_1 = require("../../services/appointments/CreateAppointmentsServices");
class CreateAppointmentsControllers {
    async handle(request, response) {
        const { serviceId, doctorId, bookingDate, bookingHour, clientId } = request.body;
        try {
            const appointmentsRepository = new AppointmentsRepository_1.AppointmentsRepository();
            const service = new CreateAppointmentsServices_1.CreateAppointmentsServices(appointmentsRepository);
            // const result = await service.execute({ userId: clientId, serviceId, doctorId, bookingDate, bookingHour })
            return response.status(200).json({ message: 'Agendamento feito com sucesso.' });
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new CreateAppointmentsControllers;
