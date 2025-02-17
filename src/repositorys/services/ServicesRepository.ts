import { prismaClient } from "../../db/prismaClient";
import { IServicesRepository, servicesRequest, servicesSaved} from "./IServicesRepository";






export class ServicesRepository implements IServicesRepository{
    
    async save({title, description}: servicesRequest): Promise<void> {
        
        await prismaClient.service.create({
            data: {
                title,
                description,
                createdAt: new Date()
            }
        })
    }
    
    async findAll(): Promise<servicesSaved[] | null> {
        return await prismaClient.service.findMany()
    }

    // Web
    // async findAllClinic(id: string): Promise<servicesSaved[] | null> {
    //     return await prismaClient.service.findMany({
    //         where:{
    //             id,
    //         }
    //     })
    // }

    async findById(id: string): Promise<servicesSaved | null> {
        return await prismaClient.service.findFirst({
            where:{
                id
            }
        })
    }

    async findByName(title: string): Promise<servicesSaved | null> {
        return await prismaClient.service.findFirst({
            where:{
                title,
            }
        })
    }
    
    async update(id: string, data: servicesRequest): Promise<void> {
        await prismaClient.service.update({
            where: {
                id: id
            },
            data: {
                title: data.title,
                description: data.description
            }
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