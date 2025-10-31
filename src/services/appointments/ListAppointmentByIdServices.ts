import { appointmentsSave, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";






class ListAppointmentByIdServices {

    constructor(private IAppointmentsRepository: IAppointmentsRepository) { }

    async execute(id: string): Promise<appointmentsSave | null> {

        const appointments = await this.IAppointmentsRepository.findById(id);

        return appointments
    }
}

export { ListAppointmentByIdServices };