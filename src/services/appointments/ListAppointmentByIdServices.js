"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAppointmentByIdServices = void 0;
class ListAppointmentByIdServices {
    IAppointmentsRepository;
    constructor(IAppointmentsRepository) {
        this.IAppointmentsRepository = IAppointmentsRepository;
    }
    async execute(id) {
        const appointments = await this.IAppointmentsRepository.findById(id);
        return appointments;
    }
}
exports.ListAppointmentByIdServices = ListAppointmentByIdServices;
