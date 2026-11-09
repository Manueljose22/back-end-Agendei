"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAppointmentByPatientsServices = void 0;
class ListAppointmentByPatientsServices {
    IAppointmentsRepository;
    constructor(IAppointmentsRepository) {
        this.IAppointmentsRepository = IAppointmentsRepository;
    }
    async execute(userId) {
        const appointments = await this.IAppointmentsRepository.findAllByPatient(userId);
        return appointments;
    }
}
exports.ListAppointmentByPatientsServices = ListAppointmentByPatientsServices;
