import { appointmentsSave, IAppointmentsRepository } from "../../repositorys/appointments/IAppointmentsRepository";






class ListAppointmentByUserServices {

    constructor(private IAppointmentsRepository: IAppointmentsRepository) { }

    async execute(userId: string): Promise<appointmentsSave[] | null> {

        const appointments = await this.IAppointmentsRepository.findAllByUser(userId);

        return appointments
    }
}

export { ListAppointmentByUserServices };