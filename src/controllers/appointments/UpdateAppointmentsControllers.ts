import { Request, Response } from "express";
import { AppointmentsRepository } from "../../repositories/appointments/AppointmentsRepository";
import { UpdateAppointmentsServices } from "../../services/appointments/UpdateAppointmentsServices";

class UpdateAppointmentsControllers {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
        const { bookingDate, bookingHour, serviceId } = request.body;

        try {
            const repository = new AppointmentsRepository();
            const service = new UpdateAppointmentsServices(repository);

            await service.execute(
                id,
                { bookingDate, bookingHour, serviceId },
                request.userId,
                request.userRole
            );

            return response.status(200).json({ message: "Consulta actualizada com sucesso." });
        } catch (error: any) {
            return response.status(400).json({ message: error.message });
        }
    }
}

export default new UpdateAppointmentsControllers();
