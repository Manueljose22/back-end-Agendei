"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAppointmentsServices = void 0;
class ListAppointmentsServices {
    IAppointmentsRepository;
    constructor(IAppointmentsRepository) {
        this.IAppointmentsRepository = IAppointmentsRepository;
    }
    async execute(search) {
        const appointments = await this.IAppointmentsRepository.findAll(search);
        return appointments;
    }
}
exports.ListAppointmentsServices = ListAppointmentsServices;
