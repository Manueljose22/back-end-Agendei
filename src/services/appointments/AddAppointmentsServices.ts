import { appointmentsRequest, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";





class AddAppointmentsServices {

    constructor(private IAppointmentsRepository: IAppointmentsRepository, private ITimeTablesRepository: ITimetablesRepository) { }

    async execute({ patientId, serviceId, doctorId, bookingDate, bookingHour }: appointmentsRequest): Promise<void | Error> {

        const availability = await this.ITimeTablesRepository.getAvailabilityByDoctor(doctorId);

        //Validações básicas
        if (!serviceId) throw new Error("Informe o serviço a agendar.");
        if (!doctorId) throw new Error("Informe o médico pretendido.");
        if (!bookingDate) throw new Error("Informe a data a agendar.");
        if (!bookingHour) throw new Error("Informe a hora a agendar.");


        if (availability.length === 0) {
            throw new Error('O médico não possui disponibilidade para agendamentos.')

        }

        //Verifica se há disponibilidade na data
        const dateAvailable = availability.find(
            (avail) => avail.date.toISOString().split("T")[0] === bookingDate
        );

        if (!dateAvailable) {
            throw new Error("O médico não possui disponibilidade para a data selecionada.");
        }

        //Verifica se a hora está disponível
        const bookingHourFormatted = bookingHour.substring(0, 5); 

        const hourAvailable = dateAvailable.timetables.find((time) => {
            const timeHour = time.hour.toISOString().split("T")[1].substring(0, 5);
            const timeDate = availability.some((avail) => avail.date.toISOString().split("T")[0] === bookingDate)
          
            return (
                !time.isBooked &&
                timeDate &&
                timeHour === bookingHourFormatted
            );
        });

         if (!hourAvailable) {
        throw new Error("O horário selecionado não está disponível para agendamento.");
    }

        await this.IAppointmentsRepository.save({ patientId, serviceId, doctorId, bookingDate, bookingHour });
        await this.ITimeTablesRepository.bookHour(hourAvailable.id);
    }
}

export { AddAppointmentsServices };