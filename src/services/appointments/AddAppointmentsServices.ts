import { appointmentsRequest, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { DoctorAvailabilityService } from "../schedules/DoctorAvailabilityService";

class AddAppointmentsServices {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    async execute({ patientId, serviceId, doctorId, bookingDate, bookingHour }: appointmentsRequest): Promise<void> {
        if (!patientId) throw new Error("Paciente não identificado.");
        if (!serviceId) throw new Error("Informe o serviço a agendar.");
        if (!doctorId) throw new Error("Informe o médico pretendido.");
        if (!bookingDate || !/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
            throw new Error("Informe uma data válida no formato YYYY-MM-DD.");
        }
        if (!bookingHour || !/^([01]\d|2[0-3]):[0-5]\d$/.test(bookingHour.substring(0, 5))) {
            throw new Error("Informe uma hora válida no formato HH:mm.");
        }

        const normalizedHour = bookingHour.substring(0, 5);
        const availabilityService = new DoctorAvailabilityService();

        // Gera os períodos da data solicitada de forma idempotente antes de reservar.
        await availabilityService.generateAndList(doctorId, bookingDate, bookingDate);

        // A duração é obtida no servidor através da associação Doctor_Service.
        // O repositório valida o intervalo completo e efectua a reserva atomicamente.
        await this.appointmentsRepository.createWithSchedule({
            patientId,
            serviceId,
            doctorId,
            bookingDate,
            bookingHour: normalizedHour
        });
    }
}

export { AddAppointmentsServices };
