import { AppError } from "../../errors/AppError";
import { appointmentsRequest, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";

class CreateAppointmentsServices {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    async execute({ patientId, serviceId, doctorId, bookingDate, bookingHour }: appointmentsRequest): Promise<void> {
        if (!patientId) {
            throw new AppError("Paciente não identificado.", 401);
        }
        if (!serviceId) {
            throw new AppError("Informe o serviço a agendar.", 400);
        }
        if (!doctorId) {
            throw new AppError("Informe o médico pretendido.", 400);
        }
        if (!bookingDate) {
            throw new AppError("Informe a data a agendar.", 400);
        }
        if (!bookingHour) {
            throw new AppError("Informe a hora a agendar.", 400);
        }

        await this.appointmentsRepository.save({ patientId, serviceId, doctorId, bookingDate, bookingHour });
    }
}

export { CreateAppointmentsServices };
