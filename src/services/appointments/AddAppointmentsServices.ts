import { appointmentsRequest, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class AddAppointmentsServices {
    constructor(
        private appointmentsRepository: IAppointmentsRepository,
        private timetablesRepository: ITimetablesRepository
    ) {}

    async execute({ patientId, serviceId, doctorId, bookingDate, bookingHour }: appointmentsRequest): Promise<void> {
        if (!patientId) throw new Error("Paciente não identificado.");
        if (!serviceId) throw new Error("Informe o serviço a agendar.");
        if (!doctorId) throw new Error("Informe o médico pretendido.");
        if (!bookingDate) throw new Error("Informe a data a agendar.");
        if (!bookingHour) throw new Error("Informe a hora a agendar.");

        const availability = await this.timetablesRepository.getAvailabilityByDoctor(doctorId);
        const dateAvailable = availability.find(
            (item) => item.date.toISOString().split("T")[0] === bookingDate
        );

        if (!dateAvailable) {
            throw new Error("O médico não possui disponibilidade para a data seleccionada.");
        }

        if (dateAvailable.isBlocked) {
            throw new Error("A disponibilidade deste médico está bloqueada para a data seleccionada.");
        }

        const bookingHourFormatted = bookingHour.substring(0, 5);
        const hourAvailable = dateAvailable.timetables.find((time) => {
            const timeHour = time.hour.toISOString().split("T")[1].substring(0, 5);
            return !time.isBooked && timeHour === bookingHourFormatted;
        });

        if (!hourAvailable) {
            throw new Error("O horário seleccionado não está disponível para agendamento.");
        }

        // A reserva do horário e a criação da consulta são confirmadas na mesma transacção.
        await this.appointmentsRepository.createWithBookedHour(
            { patientId, serviceId, doctorId, bookingDate, bookingHour: bookingHourFormatted },
            hourAvailable.id
        );
    }
}

export { AddAppointmentsServices };
