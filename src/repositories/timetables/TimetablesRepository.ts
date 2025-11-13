import { prismaClient } from "../../config/prisma/prismaClient";
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
    await prismaClient.timetables_Appointment.deleteMany({
      where: { availabilityId: id },
    });

    await prismaClient.availability.delete({
      where: { id },
    });
  }


  // ✅ Marcar um horário como reservado
  async bookHour(timetableId: string): Promise<void> {
    await prismaClient.timetables_Appointment.update({
      where: { id: timetableId },
      data: { isBooked: true },
    });
  }

  
  // ✅ Liberar um horário (ex: cancelamento)
  async unbookHour(timetableId: string): Promise<void> {
    await prismaClient.timetables_Appointment.update({
      where: { id: timetableId },
      data: { isBooked: false },
    });
  }
}
