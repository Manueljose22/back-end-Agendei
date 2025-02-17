import { appointmentsSave, IAppointmentsRepository } from "../../repositorys/appointments/IAppointmentsRepository";




class ListAppointmentsServices {

    constructor(private IAppointmentsRepository: IAppointmentsRepository) { }

    async execute(search: string): Promise<appointmentsSave[] | null> {
        
        const  appointments = await this.IAppointmentsRepository.findAll(search);
        
        return appointments
    }
}

export { ListAppointmentsServices };