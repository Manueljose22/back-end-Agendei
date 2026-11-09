"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentsServices = void 0;
class CreateAppointmentsServices {
    IAppointmentsRepository;
    constructor(IAppointmentsRepository) {
        this.IAppointmentsRepository = IAppointmentsRepository;
    }
    async execute({ patientId, serviceId, doctorId, bookingDate, bookingHour }) {
        if (!serviceId) {
            throw new Error('Informe o serviço a agendar.');
        }
        else if (!doctorId) {
            throw new Error('Informe o doctor com pretende a agendar.');
        }
        else if (!bookingDate) {
            throw new Error('Informe a data a agendar.');
        }
        else if (!bookingHour) {
            throw new Error('Informe a hora a agendar.');
        }
        await this.IAppointmentsRepository.save({ patientId, serviceId, doctorId, bookingDate, bookingHour });
    }
}
exports.CreateAppointmentsServices = CreateAppointmentsServices;
