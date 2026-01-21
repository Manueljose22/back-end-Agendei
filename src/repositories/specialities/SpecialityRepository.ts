import { prismaClient } from "../../config/prisma/prismaClient";
import { specialityInput, ISpecialityRepository, specialitySaved } from "./ISpecialityRepository";




export class SpecialityRepository implements ISpecialityRepository {
    
    async findByHospitails(id: string): Promise<specialitySaved[]> {
       return await prismaClient.specialty.findMany({
            where: {
                hospitalId: id
            }
        })
    }

    async create(data: specialityInput): Promise<specialitySaved> {
        return await prismaClient.specialty.create({
            data
        })
    }

    async findById(id: string): Promise<specialitySaved> {
        return await prismaClient.specialty.findFirst({
            where: {
                id
            }
        })
    }

    async findByName(name: string): Promise<specialitySaved> {
        return await prismaClient.specialty.findFirst({
            where: {
                name
            }
        })
    }

    async findAll(): Promise<specialitySaved[] | null> {
        return await prismaClient.specialty.findMany({
            include:{
                doctor: false
            }
        });
    }

    async update(id: string, { name }: specialityInput): Promise<void> {
        await prismaClient.specialty.update({
            where: {
                id,
            }
            , data: {
                name,
                updatedAt: new Date
            }
        })
    }

    async delete(id: string): Promise<void> {
        await prismaClient.specialty.delete({
            where: {
                id
            }
        })
    }

}