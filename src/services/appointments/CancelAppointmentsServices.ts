import { IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";





class CancelAppointmentsServices {

    constructor(private IAppointmentsRepository: IAppointmentsRepository, private ITimeTablesRepository: ITimetablesRepository) { }

    async execute(idAppoitment: string, userId: string): Promise<void | Error> {
        
        const appointment = await this.IAppointmentsRepository.findById(idAppoitment);
        const booking = await this.ITimeTablesRepository.getAvailabilityByDate(appointment!.idDoctor, appointment?.booking_date.toISOString().split('T')[0]!);

        if (!appointment) {
            throw new Error('Agendamneto inválido.');
        }

        if (appointment.patientId !== userId) {
            throw new Error('Não será possivel concluir esta operação, por favor tente mais tarde!');
        }

        const isHourBooked = booking[0].timetables.find((time) => {
            return time.hour.toISOString().split('T')[1].substring(0,5) === appointment.booking_hour
        });

    
        await this.IAppointmentsRepository.cancel(idAppoitment)
        await this.ITimeTablesRepository.unbookHour(isHourBooked!.id);   
    }
}

export { CancelAppointmentsServices };