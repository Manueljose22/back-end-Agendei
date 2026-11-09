"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelAppointmentsServices = void 0;
class CancelAppointmentsServices {
    IAppointmentsRepository;
    ITimeTablesRepository;
    constructor(IAppointmentsRepository, ITimeTablesRepository) {
        this.IAppointmentsRepository = IAppointmentsRepository;
        this.ITimeTablesRepository = ITimeTablesRepository;
    }
    async execute(idAppoitment, userId) {
        const appointment = await this.IAppointmentsRepository.findById(idAppoitment);
        const booking = await this.ITimeTablesRepository.getAvailabilityByDate(appointment.idDoctor, appointment?.booking_date.toISOString().split('T')[0]);
        if (!appointment) {
            throw new Error('Agendamneto inválido.');
        }
        if (appointment.patientId !== userId) {
            throw new Error('Não será possivel concluir esta operação, por favor tente mais tarde!');
        }
        const isHourBooked = booking[0].timetables.find((time) => {
            return time.hour.toISOString().split('T')[1].substring(0, 5) === appointment.booking_hour;
        });
        await this.IAppointmentsRepository.cancel(idAppoitment);
        await this.ITimeTablesRepository.unbookHour(isHourBooked.id);
    }
}
exports.CancelAppointmentsServices = CancelAppointmentsServices;
