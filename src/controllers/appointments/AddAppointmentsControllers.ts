import { NextFunction, Request, Response } from "express";
import { AppointmentsRepository } from "../../repositories/appointments/AppointmentsRepository";
import { AddAppointmentsServices } from "../../services/appointments/AddAppointmentsServices";

class AddAppointmentsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { userId } = request;
        const { serviceId, doctorId, bookingDate, bookingHour } = request.body;

        try {
            const appointmentsRepository = new AppointmentsRepository();
            const service = new AddAppointmentsServices(appointmentsRepository);

            await service.execute({
                patientId: userId,
                serviceId,
                doctorId,
                bookingDate,
                bookingHour
            });

            return response.status(201).json({ message: "Agendamento feito com sucesso." });
        } catch (error) {
            return next(error);
        }
    }
}

export default new AddAppointmentsControllers();
