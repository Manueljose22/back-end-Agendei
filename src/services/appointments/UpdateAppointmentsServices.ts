import { appointmentsRequest, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";





class UpdateAppointmentsServices {

    constructor(private IAppointmentsRepository: IAppointmentsRepository) { }

    async execute(id: string, { bookingDate, bookingHour, serviceId }: Pick<appointmentsRequest, 'bookingDate' | 'bookingHour' | 'serviceId'>): Promise<void | Error> {

        const appointment = await this.IAppointmentsRepository.findById(id);

        if (!appointment) {
            throw new Error('Serviço inválido.');
        }

        await this.IAppointmentsRepository.update(id, { bookingDate, bookingHour, serviceId });
    }
}

export { UpdateAppointmentsServices };