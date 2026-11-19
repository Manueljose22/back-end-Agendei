import { NextFunction, Request, Response } from "express";
import { AppointmentsRepository } from "../../repositories/appointments/AppointmentsRepository";
import { UpdateAppointmentsServices } from "../../services/appointments/UpdateAppointmentsServices";

class UpdateAppointmentsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
        const { bookingDate, bookingHour, serviceId } = request.body;

        try {
            const appointmentsRepository = new AppointmentsRepository();
            const service = new UpdateAppointmentsServices(appointmentsRepository);

            await service.execute(
                id,
                { bookingDate, bookingHour, serviceId },
                request.userId,
                request.userRole
            );

            return response.status(200).json({ message: "Consulta actualizada com sucesso." });
        } catch (error) {
            return next(error);
        }
    }
}

export default new UpdateAppointmentsControllers();
