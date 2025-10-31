import { appointmentsSave, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";






class ListAppointmentByPatientsServices {

    constructor(private IAppointmentsRepository: IAppointmentsRepository) { }

    async execute(userId: string): Promise<appointmentsSave[] | null> {

        const appointments = await this.IAppointmentsRepository.findAllByPatient(userId);

        return appointments
    }
}

export { ListAppointmentByPatientsServices };