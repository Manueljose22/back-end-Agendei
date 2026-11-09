"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppointmentsRepository_1 = require("../../repositories/appointments/AppointmentsRepository");
const ListAppointmentByPatientsServices_1 = require("../../services/appointments/ListAppointmentByPatientsServices");
class ListAppointmentByPatientsControllers {
    async handle(request, response) {
        const { userId } = request;
        try {
            const appointmentsRepository = new AppointmentsRepository_1.AppointmentsRepository();
            const service = new ListAppointmentByPatientsServices_1.ListAppointmentByPatientsServices(appointmentsRepository);
            const result = await service.execute(userId);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ListAppointmentByPatientsControllers;
