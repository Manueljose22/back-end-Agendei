"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsRepository = void 0;
const prismaClient_1 = require("../../config/prisma/prismaClient");
class PatientsRepository {
    async updatePassword(id, password) {
        await prismaClient_1.prismaClient.patient.update({
            where: {
                id
            },
            data: {
                password
            }
        });
    }
    async save(data) {
        return await prismaClient_1.prismaClient.patient.create({
            data: data
        });
    }
    async findByName(name) {
        return await prismaClient_1.prismaClient.patient.findFirst({
            where: {
                name
            }
        });
    }
    async findByEmail(email) {
        return await prismaClient_1.prismaClient.patient.findFirst({
            where: {
                email
            }
        });
    }
    async findById(id) {
        return await prismaClient_1.prismaClient.patient.findFirst({
            where: {
                id,
            }
        });
    }
    async findAll(search) {
        let patients;
        if (search) {
            patients = await prismaClient_1.prismaClient.patient.findMany({
                where: {
                    name: {
                        contains: search
                    }
                }
            });
        }
        else {
            patients = await prismaClient_1.prismaClient.patient.findMany();
        }
        return patients;
    }
    async findSearch(search) {
        return await prismaClient_1.prismaClient.patient.findMany({
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
                    }
                ]
            }
        });
    }
    async update(id, { name, email, password, address, dateBirth, gender, phone, photo }) {
        return await prismaClient_1.prismaClient.patient.update({
            where: {
                id
            },
            data: {
                name,
                email,
                password,
                address,
                dateBirth,
                gender,
                phone,
                photo,
                updatedAt: new Date()
            }
        });
    }
    async delete(id) {
        await prismaClient_1.prismaClient.patient.delete({
            where: {
                id
            }
        });
    }
}
exports.PatientsRepository = PatientsRepository;
