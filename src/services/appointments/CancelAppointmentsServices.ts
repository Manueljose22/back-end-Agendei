import { IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";





class CancelAppointmentsServices {

    constructor(private IAppointmentsRepository: IAppointmentsRepository) { }

    async execute(idAppoitment: string, userId: string): Promise<void | Error> {
        
        const appointment = await this.IAppointmentsRepository.findById(idAppoitment);

        if (!appointment) {
            throw new Error('Agendamneto inválido.');
        }

        if (appointment.patientId !== userId) {
            throw new Error('Não será possivel concluir esta operação, por favor tente mais tarde!');
        }

        // verificar se o agendamento que esta a elimeninar é mesmo do usuário logado.    

        await this.IAppointmentsRepository.cancel(idAppoitment)
    }
}

export { CancelAppointmentsServices };