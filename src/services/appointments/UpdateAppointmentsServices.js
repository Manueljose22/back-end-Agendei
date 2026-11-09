"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppointmentsServices = void 0;
class UpdateAppointmentsServices {
    IAppointmentsRepository;
    constructor(IAppointmentsRepository) {
        this.IAppointmentsRepository = IAppointmentsRepository;
    }
    async execute(id, { bookingDate, bookingHour, serviceId }) {
        const appointment = await this.IAppointmentsRepository.findById(id);
        if (!appointment) {
            throw new Error('Serviço inválido.');
        }
        await this.IAppointmentsRepository.update(id, { bookingDate, bookingHour, serviceId });
    }
}
exports.UpdateAppointmentsServices = UpdateAppointmentsServices;
