import { AppointmentAccess, appointmentsSave, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";

class ListAppointmentsServices {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    async execute(search: string, access: AppointmentAccess): Promise<appointmentsSave[] | null> {
        return this.appointmentsRepository.findAll(search, access);
    }
}

export { ListAppointmentsServices };
