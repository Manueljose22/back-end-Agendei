"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimetablesRepository = void 0;
const prismaClient_1 = require("../../config/prisma/prismaClient");
class TimetablesRepository {
    async createAvailability(data) {
        await prismaClient_1.prismaClient.availability.create({
            data: {
                doctorId: data.doctorId,
                date: new Date(`${data.date}T00:00:00Z`),
                hourStart: new Date(`1970-01-01T${data.hourStart}:00Z`),
                hourEnd: new Date(`1970-01-01T${data.hourEnd}:00Z`),
            },
        });
    }
    //  Gerar automaticamente os horários (intervalos de 45min)
    async generateHours(availabilityId, hourStart, hourEnd) {
        const start = new Date(`1970-01-01T${hourStart}:00`);
        const end = new Date(`1970-01-01T${hourEnd}:00`);
        const hours = [];
        for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + 45)) {
            hours.push(time.toTimeString().substring(0, 5)); // exemplo: "08:00"
        }
        for (const hour of hours) {
            await prismaClient_1.prismaClient.timetables_Appointment.create({
                data: {
                    availabilityId,
                    hour: new Date(`1970-01-01T${hour}:00`),
                },
            });
        }
    }
    //Buscar todas as disponibilidades de um médico
    async getAvailabilityByDoctor(doctorId) {
        const availability = await prismaClient_1.prismaClient.availability.findMany({
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
    async getAvailabilityByDate(doctorId, date) {
        return await prismaClient_1.prismaClient.availability.findMany({
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
    async updateAvailability(id, data) {
        await prismaClient_1.prismaClient.availability.update({
            where: { id },
            data: {
                hourStart: data.hourStart,
                hourEnd: data.hourEnd,
            },
        });
    }
    // Bloquear dia (ex: feriado ou ausência)
    async blockDay(id) {
        await prismaClient_1.prismaClient.availability.update({
            where: { id },
            data: { isBlocked: true },
        });
    }
    // Desbloquear dia
    async unblockDay(id) {
        await prismaClient_1.prismaClient.availability.update({
            where: { id },
            data: { isBlocked: false },
        });
    }
    //Deletar disponibilidade e horários associados
    async deleteAvailability(id) {
        await prismaClient_1.prismaClient.timetables_Appointment.deleteMany({
            where: { availabilityId: id },
        });
        await prismaClient_1.prismaClient.availability.delete({
            where: { id },
        });
    }
    // ✅ Marcar um horário como reservado
    async bookHour(timetableId) {
        await prismaClient_1.prismaClient.timetables_Appointment.update({
            where: { id: timetableId },
            data: { isBooked: true },
        });
    }
    // ✅ Liberar um horário (ex: cancelamento)
    async unbookHour(timetableId) {
        await prismaClient_1.prismaClient.timetables_Appointment.update({
            where: { id: timetableId },
            data: { isBooked: false },
        });
    }
}
exports.TimetablesRepository = TimetablesRepository;
