"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialityRepository = void 0;
const prismaClient_1 = require("../../config/prisma/prismaClient");
class SpecialityRepository {
    async findByHospitails(id) {
        return await prismaClient_1.prismaClient.specialty.findMany({
            where: {
                hospitalId: id
            }
        });
    }
    async create(data) {
        return await prismaClient_1.prismaClient.specialty.create({
            data
        });
    }
    async findById(id) {
        return await prismaClient_1.prismaClient.specialty.findFirst({
            where: {
                id
            }
        });
    }
    async findByName(name) {
        return await prismaClient_1.prismaClient.specialty.findFirst({
            where: {
                name
            }
        });
    }
    async findAll() {
        return await prismaClient_1.prismaClient.specialty.findMany({
            include: {
                doctor: false
            }
        });
    }
    async findSearch(search) {
        return await prismaClient_1.prismaClient.specialty.findMany({
            take: 10,
            where: {
                name: {
                    contains: search,
                }
            }
        });
    }
    async update(id, { name, color, description }) {
        await prismaClient_1.prismaClient.specialty.update({
            where: {
                id,
            },
            data: {
                name,
                color,
                description,
                updatedAt: new Date
            }
        });
    }
    async delete(id) {
        await prismaClient_1.prismaClient.specialty.delete({
            where: {
                id
            }
        });
    }
}
exports.SpecialityRepository = SpecialityRepository;
