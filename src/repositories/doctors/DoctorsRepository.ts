import { HospitalStatus } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prismaClient } from "../../config/prisma/prismaClient";
import { IDoctorsRepository, doctorRequest, doctorSave, doctorServices, UpdateDoctor } from "./IDoctorsRepository";

const doctorSelect = {
    id: true,
    name: true,
    photo: true,
    email: true,
    status: true,
    phone: true,
    bio: true,
    address: true,
    yaersOfExperience: true,
    numberOfPatients: true,
    rating: true,
    specialtyId: true,
    hospitalId: true,
    createdAt: true,
    updatedAt: true,
    Specialty: { select: { id: true, name: true } },
    Hospital: {
        select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true,
            images: { select: { id: true, urlImagem: true } },
            createdAt: true
        }
    }
} as const;

export class DoctorsRepository implements IDoctorsRepository {
    async serviceToDoctor({ serviceId, doctorId, price, durationMinutes }: { serviceId: string; doctorId: string; price: number; durationMinutes: number }): Promise<void> {
        await prismaClient.doctor_Service.upsert({
            where: { doctorId_serviceId: { doctorId, serviceId } },
            create: { serviceId, doctorId, price, durationMinutes },
            update: { price, durationMinutes }
        });
    }

    async findDoctorService(doctorId: string): Promise<doctorServices[]> {
        const records = await prismaClient.doctor_Service.findMany({
            where: { doctorId },
            select: {
                serviceId: true,
                price: true,
                durationMinutes: true,
                Service: { select: { title: true } }
            }
        });

        return records.map(item => ({
            idService: item.serviceId,
            title: item.Service.title,
            price: item.price,
            durationMinutes: item.durationMinutes
        }));
    }

    async save(data: doctorRequest): Promise<void> {
        await prismaClient.doctor.create({ data });
    }

    async findByName(name: string, hospitalId?: string): Promise<doctorSave | null> {
        return prismaClient.doctor.findFirst({
            where: { name, hospitalId: hospitalId ?? undefined },
            select: doctorSelect
        });
    }

    async findById(id: string, hospitalId?: string, includeSuspended = false): Promise<doctorSave | null> {
        return prismaClient.doctor.findFirst({
            where: {
                id,
                hospitalId: hospitalId ?? undefined,
                Hospital: includeSuspended ? undefined : { is: { status: HospitalStatus.ACTIVE } }
            },
            select: doctorSelect
        });
    }

    async findAll(hospitalId?: string, includeSuspended = false): Promise<doctorSave[]> {
        return prismaClient.doctor.findMany({
            where: {
                hospitalId: hospitalId ?? undefined,
                Hospital: includeSuspended ? undefined : { is: { status: HospitalStatus.ACTIVE } }
            },
            select: doctorSelect,
            orderBy: { createdAt: "desc" }
        });
    }

    async findAllByHospital(idHospital: string, includeSuspended = false): Promise<doctorSave[]> {
        return this.findAll(idHospital, includeSuspended);
    }

    async findSearch(search: string, hospitalId?: string, includeSuspended = false): Promise<doctorSave[]> {
        return prismaClient.doctor.findMany({
            take: 10,
            where: {
                hospitalId: hospitalId ?? undefined,
                Hospital: includeSuspended ? undefined : { is: { status: HospitalStatus.ACTIVE } },
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { Specialty: { is: { name: { contains: search, mode: "insensitive" } } } }
                ]
            },
            select: doctorSelect,
            orderBy: { createdAt: "desc" }
        });
    }

    async specialtyBelongsToHospital(specialtyId: string, hospitalId: string): Promise<boolean> {
        const specialty = await prismaClient.specialty.findFirst({
            where: { id: specialtyId, hospitalId },
            select: { id: true }
        });
        return Boolean(specialty);
    }

    async serviceBelongsToHospital(serviceId: string, hospitalId: string): Promise<boolean> {
        const service = await prismaClient.service.findFirst({
            where: {
                id: serviceId,
                specialty: { is: { hospitalId } }
            },
            select: { id: true }
        });
        return Boolean(service);
    }

    async update(id: string, data: UpdateDoctor, hospitalId?: string): Promise<void> {
        const result = await prismaClient.doctor.updateMany({
            where: { id, hospitalId: hospitalId ?? undefined },
            data
        });

        if (result.count !== 1) {
            throw new AppError("Médico não encontrado.", 404);
        }
    }

    async delete(hospitalId: string, id: string): Promise<void> {
        const result = await prismaClient.doctor.deleteMany({
            where: { id, hospitalId }
        });

        if (result.count !== 1) {
            throw new AppError("Médico não encontrado.", 404);
        }
    }
}
