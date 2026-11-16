import { Request, Response } from "express";
import { AppointmentsRepository } from "../../repositories/appointments/AppointmentsRepository";
import { CancelAppointmentsServices } from "../../services/appointments/CancelAppointmentsServices";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";

class CancelAppointmentsControllers {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const appointmentsRepository = new AppointmentsRepository();
            const timetablesRepository = new TimetablesRepository();
            const service = new CancelAppointmentsServices(appointmentsRepository, timetablesRepository);

            await service.execute(id, request.userId, request.userRole);

            return response.status(200).json({ message: "Consulta cancelada com sucesso." });
        } catch (error: any) {
            return response.status(400).json({ message: error.message });
        }
    }
}

export default new CancelAppointmentsControllers();
