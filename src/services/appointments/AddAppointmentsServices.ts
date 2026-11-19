import { AppError } from "../../errors/AppError";
import { appointmentsRequest, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { DoctorAvailabilityService } from "../schedules/DoctorAvailabilityService";

class AddAppointmentsServices {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    async execute({ patientId, serviceId, doctorId, bookingDate, bookingHour }: appointmentsRequest): Promise<void> {
        if (!patientId) throw new AppError("Paciente não identificado.", 401);
        if (!serviceId) throw new AppError("Informe o serviço a agendar.", 400);
        if (!doctorId) throw new AppError("Informe o médico pretendido.", 400);
        if (!bookingDate || !/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
            throw new AppError("Informe uma data válida no formato YYYY-MM-DD.", 400);
        }
        if (!bookingHour || !/^([01]\d|2[0-3]):[0-5]\d$/.test(bookingHour.substring(0, 5))) {
            throw new AppError("Informe uma hora válida no formato HH:mm.", 400);
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
