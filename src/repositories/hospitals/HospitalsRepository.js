"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalsRepository = void 0;
const bcrypt_1 = require("bcrypt");
const prismaClient_1 = require("../../config/prisma/prismaClient");
class HospitalsRepository {
    async create(data) {
        const passwordHash = await (0, bcrypt_1.hash)(data.password, 12);
        await prismaClient_1.prismaClient.hospital.create({
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email,
                password: passwordHash,
                nif: data.nif,
                // images: {
                //     create: images
                // }
            }
        });
    }
    async findById(id) {
        return await prismaClient_1.prismaClient.hospital.findFirst({
            where: {
                id
            }, include: {
                images: {
                    select: {
                        urlImagem: true
                    }
                }
            }
        });
    }
    async findByName(name) {
        return await prismaClient_1.prismaClient.hospital.findFirst({
            where: {
                name
            }, include: {
                images: {
                    select: {
                        urlImagem: true
                    }
                }
            }
        });
    }
    async findList() {
        return await prismaClient_1.prismaClient.hospital.findMany({
            include: {
                images: {
                    select: {
                        urlImagem: true
                    }
                }
            }
        });
    }
    async findSearch(search) {
        return await prismaClient_1.prismaClient.hospital.findMany({
            take: 10,
            where: {
                OR: [
                    {
                        name: {
                            contains: search,
                        }
                    },
                    {
                        email: {
                            contains: search,
                        }
                    },
                    {
                        address: {
                            contains: search,
                        }
                    }
                ]
            },
            include: {
                images: {
                    select: {
                        urlImagem: true
                    }
                }
            }
        });
    }
    async update(id, data, images) {
        await prismaClient_1.prismaClient.hospital.update({
            where: {
                id
            },
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email,
                password: data.password,
                images: {
                    updateMany: images
                },
                updatedAt: new Date()
            }
        });
    }
    async delete(id) {
        await prismaClient_1.prismaClient.hospital.delete({
            where: {
                id,
            }
        });
    }
}
exports.HospitalsRepository = HospitalsRepository;
