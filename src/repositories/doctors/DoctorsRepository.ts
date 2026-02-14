
import { prismaClient } from "../../config/prisma/prismaClient";
import { IDoctorsRepository, doctorRequest, doctorSave, doctorServices } from "./IDoctorsRepository";





export class DoctorsRepository implements IDoctorsRepository {
    
    async serviceToDoctor({serviceId, doctorId, price}: {serviceId: string, doctorId: string, price: number}): Promise<void> {
        await prismaClient.doctor_Service.create({
            data: {
                serviceId,
                doctorId,
                price
            }
        })

    }

    // Listar os serviços do médico
    async findDoctorService(doctorId: string): Promise<doctorServices[] | null> {

        let service: doctorServices[] = [];

        const doctor_service = await prismaClient.doctor_Service.findMany({
            where: {
                doctorId,
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
                    title: item.Service.title,
                    price: item.price

                }

            )
        })

        return service
    }

    async save(data: doctorRequest): Promise<void> {
        await prismaClient.doctor.create({
            data: data
        })

    }

    async findByName(name: string): Promise<doctorSave | null> {

        return await prismaClient.doctor.findFirst({
            where: {
                name
            }, include: {
                Specialty: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                Hospital: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        email: true,
                        images: true,
                        createdAt: true
                    }
                }
            }
        })
    }

    async findById(id: string): Promise<doctorSave | null> {
        return await prismaClient.doctor.findFirst({
            where: {
                id
            }, include: {
                Specialty: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                Hospital: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        email: true,
                        images: {
                            select: {
                                id: true,
                                urlImagem: true,
                            }
                        },
                        createdAt: true
                    }
                }
            }
        })
    }

    async findAllByHospital(idHospital: string): Promise<doctorSave[] | null> {

        let doctors = await prismaClient.doctor.findMany({
            where: {
                Hospital: { id: idHospital}
            },
            include: {
                Specialty: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                Hospital: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        email: true,
                        images: {
                            select: {
                                id: true,
                                urlImagem: true,
                            }
                        },
                        createdAt: true
                    }
                }
            }

        })

        return doctors
    }

    async findAll(): Promise<doctorSave[] | null> {
        return await prismaClient.doctor.findMany({
             include: {
                Specialty: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                Hospital: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        email: true,
                        images: {
                            select: {
                                id: true,
                                urlImagem: true,
                            }
                        },
                        createdAt: true
                    }
                }
            }
        })
    }


    async findSearch(search: string): Promise<doctorSave[] | null> {

        const filters = search
            ? {
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } },
                    {
                        Specialty: {
                            name: { contains: search },
                        },
                    },
                ],
            }
            : {}; // Se não houver search, não filtra nada

        const doctors = await prismaClient.doctor.findMany({
            take: 10,
            where: filters,
            include: {
                Specialty: {
                    select: { id: true, name: true },
                },
                Hospital: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        email: true,
                        images: {
                            select: {
                                id: true,
                                urlImagem: true,
                            },
                        },
                        createdAt: true,
                    },
                },
            },
        });

        return doctors;
        

    }

    async update(id: string, data: doctorRequest): Promise<void> {
        await prismaClient.doctor.update({
            where: {
                id
            },
            data: data
        })

    }


    async delete(hospitalId: string, id: string): Promise<void> {
        await prismaClient.doctor.delete({
            where: {
                id, 
                AND: {hospitalId}
            }
        })
    }

}