import { prismaClient } from "../../config/prisma/prismaClient";
import { IAvailabilityInput, ITimetablesRepository } from "./ITimetablesRepository";






export class TimetablesRepository implements ITimetablesRepository {

  // ✅ Criar disponibilidade de um médico
  async createAvailability(data: IAvailabilityInput): Promise<void> {
    await prismaClient.availability.create({
      data: {
        doctorId: data.doctor_id,
        date: new Date(data.date),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
      },
    });
  }

  // ✅ Gerar automaticamente os horários (intervalos de 30min)
  async generateHours(availabilityId: string, hourStart: string, hourEnd: string): Promise<void> {
    const start = new Date(`1970-01-01T${hourStart}:00`);
    const end = new Date(`1970-01-01T${hourEnd}:00`);

    const hours: string[] = [];
    for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + 30)) {
      hours.push(time.toTimeString().substring(0, 5)); // exemplo: "08:00"
    }

    for (const hour of hours) {
      await prismaClient.timetables_Appointment.create({
        data: {
          availabilityId,
          hour,
        },
      });
    }
  }

  // ✅ Buscar todas as disponibilidades de um médico
  async getAvailabilityByDoctor(doctorId: string): Promise<IAvailability[]> {
    return await prismaClient.availability.findMany({
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
  }

  // ✅ Buscar disponibilidades por data específica
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

  // ✅ Bloquear dia (ex: feriado ou ausência)
  async blockDay(id: string): Promise<void> {
    await prismaClient.availability.update({
      where: { id },
      data: { isBlocked: true },
    });
  }

  // ✅ Desbloquear dia
  async unblockDay(id: string): Promise<void> {
    await prismaClient.availability.update({
      where: { id },
      data: { isBlocked: false },
    });
  }

  // ✅ Deletar disponibilidade e horários associados
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
