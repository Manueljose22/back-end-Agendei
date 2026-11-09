"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsRepository = void 0;
const prismaClient_1 = require("../../config/prisma/prismaClient");
class DoctorsRepository {
    async serviceToDoctor({ serviceId, doctorId, price }) {
        await prismaClient_1.prismaClient.doctor_Service.create({
            data: {
                serviceId,
                doctorId,
                price
            }
        });
    }
    // Listar os serviços do médico
    async findDoctorService(doctorId) {
        let service = [];
        const doctor_service = await prismaClient_1.prismaClient.doctor_Service.findMany({
            where: {
                doctorId,
            }, include: {
                Service: {
                    select: {
                        title: true
                    }
                }
            }
        });
        doctor_service.map((item) => {
            service.push({
                idService: item.serviceId,
                title: item.Service.title,
                price: item.price
            });
        });
        return service;
    }
    async save(data) {
        await prismaClient_1.prismaClient.doctor.create({
            data: data
        });
    }
    async findByName(name) {
        return await prismaClient_1.prismaClient.doctor.findFirst({
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
        });
    }
    async findById(id) {
        return await prismaClient_1.prismaClient.doctor.findFirst({
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
        });
    }
    async findAllByHospital(idHospital) {
        let doctors = await prismaClient_1.prismaClient.doctor.findMany({
            where: {
                Hospital: { id: idHospital }
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
        });
        return doctors;
    }
    async findAll() {
        return await prismaClient_1.prismaClient.doctor.findMany({
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
        });
    }
    async findSearch(search) {
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
        const doctors = await prismaClient_1.prismaClient.doctor.findMany({
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
    async update(id, data) {
        await prismaClient_1.prismaClient.doctor.update({
            where: {
                id
            },
            data: data
        });
    }
    async delete(hospitalId, id) {
        await prismaClient_1.prismaClient.doctor.delete({
            where: {
                id,
                AND: { hospitalId }
            }
        });
    }
}
exports.DoctorsRepository = DoctorsRepository;
