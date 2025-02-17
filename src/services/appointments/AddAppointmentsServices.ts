import { appointmentsRequest, IAppointmentsRepository } from "../../repositorys/appointments/IAppointmentsRepository";





class AddAppointmentsServices {

    constructor(private IAppointmentsRepository: IAppointmentsRepository) { }

    async execute({ userId, serviceId, doctorId, bookingDate, bookingHour }: appointmentsRequest): Promise<void | Error> {
        
        if (!serviceId) {
            throw new Error('Informe o serviço a agendar.')
        } else if(!doctorId){
            throw new Error('Informe o doctor com pretende a agendar.')
        } else if(!bookingDate){
            throw new Error('Informe a data a agendar.')
        } else if(!bookingHour){
            throw new Error('Informe a hora a agendar.')
        }

        await this.IAppointmentsRepository.save({ userId, serviceId, doctorId, bookingDate, bookingHour });
    }
}

export { AddAppointmentsServices };