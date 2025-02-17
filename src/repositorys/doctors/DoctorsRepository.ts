import { prismaClient } from "../../db/prismaClient";
import { IDoctorsRepository, doctorRequest, doctorSave, doctorServices } from "./IDoctorsRepository";





export class DoctorsRepository implements IDoctorsRepository {

    async findDoctorService(doctorId: string): Promise<doctorServices[] | null> {

        let service: doctorServices[] = [];

        const doctor_service = await prismaClient.doctor_Service.findMany({
            where: {
                doctorId,
                AND: {
                    status: 'A'
                }
            }, include: {
                Service: {
                    select: {
                        title: true
                    }
                }
            }
        })

        doctor_service.map((item) => {
            service.push(
                {
                    idService: item.serviceId,
                    description: item.Service.title,
                    price: item.price

                }

            )
        })

        return service
    }



    async save({ name, especialty, photo }: doctorRequest): Promise<void> {
        await prismaClient.doctor.create({
            data: {
                name,
                especialty,
                photo
            }
        })

    }

    async findByName(name: string): Promise<doctorSave | null> {

        return await prismaClient.doctor.findFirst({
            where: {
                name
            }
        })
    }

    async findById(id: string): Promise<doctorSave | null> {
        return await prismaClient.doctor.findFirst({
            where: {
                id
            }
        })
    }

    async findAll(search: string): Promise<doctorSave[] | null> {

        let doctors;

        if (search) {
            doctors = await prismaClient.doctor.findMany({
                where: {
                    id: {
                        contains: search
                    }
                }
            });
        } else {
            doctors = await prismaClient.doctor.findMany();
        }

        return doctors;
    }

    async findSearch(search: string): Promise<doctorSave[] | null> {
        return await prismaClient.doctor.findMany({
            where: {
                name: {
                    contains: search,
                }
            }
        })

    }

    async update(id: string, { name, especialty, photo }: doctorRequest): Promise<void> {
        await prismaClient.doctor.update({
            where: {
                id
            },
            data: {
                name,
                especialty,
                photo,
                updatedAt: new Date()
            }
        })

    }


    async delete(id: string): Promise<void> {
        await prismaClient.doctor.delete({
            where: {
                id
            }
        })
    }

}