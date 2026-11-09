"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesRepository = void 0;
const prismaClient_1 = require("../../config/prisma/prismaClient");
class ServicesRepository {
    async save(data) {
        await prismaClient_1.prismaClient.service.create({
            data: {
                title: data.title,
                price: Number(data.price),
                duraction: data.duraction,
                description: data.description,
                specialtyId: data.specialtyId,
                status: data.status
            }
        });
    }
    async findAll() {
        return await prismaClient_1.prismaClient.service.findMany({
            include: {
                specialty: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }
    // Web
    async findAllHospital(hospitalId) {
        return await prismaClient_1.prismaClient.service.findMany({
            where: {
                specialty: {
                    hospitalId: hospitalId
                }
            },
            include: {
                specialty: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }
    async findById(id) {
        return await prismaClient_1.prismaClient.service.findFirst({
            where: {
                id
            },
            include: {
                specialty: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }
    async findByName(title) {
        return await prismaClient_1.prismaClient.service.findFirst({
            where: {
                title,
            },
            include: {
                specialty: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }
    async update(id, data) {
        await prismaClient_1.prismaClient.service.update({
            where: {
                id: id
            },
            data: {
                title: data.title,
                price: Number(data.price),
                duraction: data.duraction,
                description: data.description,
                specialtyId: data.specialtyId,
                status: data.status
            }
        });
    }
    async delete(id) {
        await prismaClient_1.prismaClient.service.delete({
            where: {
                id
            }
        });
    }
}
exports.ServicesRepository = ServicesRepository;
