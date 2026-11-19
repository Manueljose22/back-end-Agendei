import { prismaClient } from "../../config/prisma/prismaClient";
import { AppError } from "../../errors/AppError";
import { IAvailability, IAvailabilityInput, ITimetablesRepository, IUpdateAvailability } from "./ITimetablesRepository";






export class TimetablesRepository implements ITimetablesRepository {

  async createAvailability(data: IAvailabilityInput): Promise<void> {
  
    await prismaClient.availability.create({
      data: {
        doctorId: data.doctorId,
        date: new Date(`${data.date}T00:00:00Z`),
        hourStart: new Date(`1970-01-01T${data.hourStart}:00Z`),
        hourEnd: new Date(`1970-01-01T${data.hourEnd}:00Z`),
      },
    });
  }

  //  Gerar automaticamente os horários (intervalos de 45min)
  async generateHours(availabilityId: string, hourStart: string, hourEnd: string): Promise<void> {
    const start = new Date(`1970-01-01T${hourStart}:00`);
    const end = new Date(`1970-01-01T${hourEnd}:00`);

    const hours: string[] = [];

    for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + 45)) {
      hours.push(time.toTimeString().substring(0, 5)); // exemplo: "08:00"
    }

    for (const hour of hours) {
      await prismaClient.timetables_Appointment.create({
        data: {
          availabilityId,
          hour: new Date(`1970-01-01T${hour}:00`),
        },
      });
    }
  }


  //Buscar todas as disponibilidades de um médico
  async getAvailabilityByDoctor(doctorId: string): Promise<IAvailability[]> {
    const availability = await prismaClient.availability.findMany({
      where: { doctorId },
      include: {
        timetables: {
          select: {
            id: true,
            hour: true,
            isBooked: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    return availability;
  }

  // Buscar disponibilidades por data específica
  async getAvailabilityByDate(doctorId: string, date: string): Promise<IAvailability[]> {
    return await prismaClient.availability.findMany({
      where: {
        doctorId,
        date: {
          gte: new Date(`${date}T00:00:00Z`),
          lt: new Date(`${date}T23:59:59Z`),
        },
      },
      include: { timetables: true },
    });
  }

  // ✅ Atualizar horário (ex: alterar hora inicial/final)
  async updateAvailability(id: string, data: IUpdateAvailability): Promise<void> {
    await prismaClient.availability.update({
      where: { id },
      data: {
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
      },
    });
  }

  // Bloquear dia (ex: feriado ou ausência)
  async blockDay(id: string): Promise<void> {
    await prismaClient.availability.update({
      where: { id },
      data: { isBlocked: true },
    });
  }

  // Desbloquear dia
  async unblockDay(id: string): Promise<void> {
    await prismaClient.availability.update({
      where: { id },
      data: { isBlocked: false },
    });
  }

  //Deletar disponibilidade e horários associados
  async deleteAvailability(id: string): Promise<void> {
    await prismaClient.$transaction(async (transaction) => {
      const availability = await transaction.availability.findUnique({
        where: { id },
        select: { id: true }
      });

      if (!availability) {
        throw new AppError("Disponibilidade não encontrada.", 404);
      }

      const bookedHours = await transaction.timetables_Appointment.count({
        where: { availabilityId: id, isBooked: true }
      });

      if (bookedHours > 0) {
        throw new AppError("Não é possível eliminar uma disponibilidade que contém horários reservados.", 409);
      }

      await transaction.timetables_Appointment.deleteMany({
        where: { availabilityId: id }
      });

      await transaction.availability.delete({
        where: { id }
      });
    });
  }


  // ✅ Marcar um horário como reservado
  async bookHour(timetableId: string): Promise<void> {
    const result = await prismaClient.timetables_Appointment.updateMany({
      where: { id: timetableId, isBooked: false },
      data: { isBooked: true }
    });

    if (result.count === 1) return;

    const timetable = await prismaClient.timetables_Appointment.findUnique({
      where: { id: timetableId },
      select: { id: true }
    });

    if (!timetable) {
      throw new AppError("Horário não encontrado.", 404);
    }

    throw new AppError("Este horário já se encontra reservado.", 409);
  }

  
  // ✅ Liberar um horário (ex: cancelamento)
  async unbookHour(timetableId: string): Promise<void> {
    const result = await prismaClient.timetables_Appointment.updateMany({
      where: { id: timetableId, isBooked: true },
      data: { isBooked: false }
    });

    if (result.count === 1) return;

    const timetable = await prismaClient.timetables_Appointment.findUnique({
      where: { id: timetableId },
      select: { id: true }
    });

    if (!timetable) {
      throw new AppError("Horário não encontrado.", 404);
    }

    throw new AppError("Este horário não se encontra reservado.", 409);
  }
}
