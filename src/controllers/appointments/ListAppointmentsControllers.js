"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppointmentsRepository_1 = require("../../repositories/appointments/AppointmentsRepository");
const ListAppointmentsServices_1 = require("../../services/appointments/ListAppointmentsServices");
class ListAppointmentsControllers {
    async handle(request, response) {
        const { search } = request.query;
        try {
            const appointmentsRepository = new AppointmentsRepository_1.AppointmentsRepository();
            const service = new ListAppointmentsServices_1.ListAppointmentsServices(appointmentsRepository);
            const result = await service.execute(search);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new ListAppointmentsControllers;
