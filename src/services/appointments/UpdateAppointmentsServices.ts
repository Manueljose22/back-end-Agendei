import { AppError } from "../../errors/AppError";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { appointmentsRequest, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { DoctorAvailabilityService } from "../schedules/DoctorAvailabilityService";

class UpdateAppointmentsServices {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    async execute(
        id: string,
        data: Partial<Pick<appointmentsRequest, "bookingDate" | "bookingHour" | "serviceId">>,
        userId: string,
        role: AccountRole
    ): Promise<void> {
        const appointment = await this.appointmentsRepository.findById(id);

        if (!appointment) throw new AppError("Consulta não encontrada.", 404);
        if (appointment.status.toLowerCase() === "cancelado") {
            throw new AppError("Não é possível alterar uma consulta cancelada.", 409);
        }

        const canManage =
            role === "platform_admin" ||
            (role === "patient" && appointment.patientId === userId) ||
            (role === "doctor" && appointment.idDoctor === userId) ||
            (role === "hospital" && appointment.hospitalId === userId);

        if (!canManage) {
            throw new AppError("Não tem permissão para alterar esta consulta.", 403);
        }

        const isChangingDateOrTime =
            data.bookingDate !== undefined || data.bookingHour !== undefined;

        if (role === "patient" && isChangingDateOrTime) {
            if (!data.bookingDate || !data.bookingHour) {
                throw new AppError("Seleccione uma nova data e um horário disponível.", 400);
            }

            const bookingDate = data.bookingDate;
            const bookingHour = data.bookingHour.substring(0, 5);
            const serviceId = data.serviceId ?? appointment.idService;

            if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
                throw new AppError("A data deve estar no formato YYYY-MM-DD.", 400);
            }

            const parsedDate = new Date(`${bookingDate}T00:00:00.000Z`);
            if (
                Number.isNaN(parsedDate.getTime()) ||
                parsedDate.toISOString().slice(0, 10) !== bookingDate
            ) {
                throw new AppError("A data seleccionada é inválida.", 400);
            }

            if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(bookingHour)) {
                throw new AppError("A hora deve estar no formato HH:mm.", 400);
            }

            // Gera os períodos do dia escolhido. O repositório volta a validar
            // disponibilidade, conflitos e concorrência dentro da transacção.
            const availabilityService = new DoctorAvailabilityService();
            await availabilityService.generateAndList(appointment.idDoctor, bookingDate, bookingDate);

            await this.appointmentsRepository.updateWithSchedule(id, {
                serviceId,
                bookingDate,
                bookingHour
            });
            return;
        }

        // Médico/hospital/admin não alteram directamente data ou hora:
        // continuam obrigados a enviar uma proposta para aceitação do paciente.
        if (isChangingDateOrTime) {
            throw new AppError(
                "A alteração de data ou hora deve ser enviada como proposta de reagendamento para aceitação do paciente.",
                409
            );
        }

        const bookingDate = appointment.booking_date.toISOString().slice(0, 10);
        const bookingHour = appointment.booking_hour.substring(0, 5);
        const serviceId = data.serviceId ?? appointment.idService;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
            throw new AppError("A data deve estar no formato YYYY-MM-DD.", 400);
        }
        const parsedDate = new Date(`${bookingDate}T00:00:00.000Z`);
        if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== bookingDate) {
            throw new AppError("A data seleccionada é inválida.", 400);
        }
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(bookingHour)) {
            throw new AppError("A hora deve estar no formato HH:mm.", 400);
        }
        if (!serviceId) throw new AppError("É necessário seleccionar um serviço.", 400);

        await this.appointmentsRepository.updateWithSchedule(
            id,
            { serviceId, bookingDate, bookingHour }
        );
    }
}

export { UpdateAppointmentsServices };
