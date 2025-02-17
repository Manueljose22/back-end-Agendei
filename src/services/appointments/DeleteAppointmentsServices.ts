import { IAppointmentsRepository } from "../../repositorys/appointments/IAppointmentsRepository";





class DeleteAppointmentsServices {

    constructor(private IAppointmentsRepository: IAppointmentsRepository) { }

    async execute(idAppoitment: string, userId: string): Promise<void | Error> {
        
        // const appointment = await this.IAppointmentsRepository.findById(idAppoitment);

        // if (!appointment) {
        //     throw new Error('Serviço inválido.');
        // }

        // verificar se o agendamento que esta a elimeninar é mesmo do usuário logado.    

        await this.IAppointmentsRepository.delete(idAppoitment)
    }
}

export { DeleteAppointmentsServices };