import { prismaClient } from "../../config/prisma/prismaClient";
import { IServicesRepository, servicesRequest, servicesSaved} from "./IServicesRepository";




export class ServicesRepository implements IServicesRepository{
    
    
    async save(data: servicesRequest): Promise<void> {
        
        await prismaClient.service.create({
            data
        })
    }
    
    async findAll(): Promise<servicesSaved[] | null> {
        return await prismaClient.service.findMany({
            include: {
                specialty:{
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
    }

    // Web
   async findAllHospital(hospitalId: string): Promise<servicesSaved[] | null> {
        return await prismaClient.service.findMany({
            where:{
                specialty:{
                    hospitalId: hospitalId
                }
            },
            include:{
                specialty:{
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
    }

    async findById(id: string): Promise<servicesSaved | null> {
        return await prismaClient.service.findFirst({
            where:{
                id
            },
            include: {
                specialty:{
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
    }

    async findByName(title: string): Promise<servicesSaved | null> {
        return await prismaClient.service.findFirst({
            where:{
                title,
            },
            include: {
                specialty:{
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
    }
    
    async update(id: string, data: servicesRequest): Promise<void> {
        await prismaClient.service.update({
            where: {
                id: id
            },
            data: data
        })
    }
    
    async delete(id: string): Promise<void> {
        await prismaClient.service.delete({
            where: {
                id
            }
        })
    }
    
}