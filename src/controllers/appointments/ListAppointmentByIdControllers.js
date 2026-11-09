"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppointmentsRepository_1 = require("../../repositories/appointments/AppointmentsRepository");
const ListAppointmentByIdServices_1 = require("../../services/appointments/ListAppointmentByIdServices");
class ListAppointmentByIdControllers {
    async handle(request, response) {
        const { id } = request.params;
        try {
            const appointmentsRepository = new AppointmentsRepository_1.AppointmentsRepository();
            const service = new ListAppointmentByIdServices_1.ListAppointmentByIdServices(appointmentsRepository);
            const result = await service.execute(id);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ListAppointmentByIdControllers;
