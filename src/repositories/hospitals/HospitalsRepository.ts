
import { prismaClient } from "../../config/prisma/prismaClient";
import { hospitalInput, hospitalSave, IHospitalsRepository } from "./IHospitalsRepository";




export class HospitalsRepository implements IHospitalsRepository {
    

    async create(data: hospitalInput, images: any): Promise<void> {

         await prismaClient.hospital.create({
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email,
                images: {
                    create: images
                }
            }
        })
    }

    async findById(id: string): Promise<hospitalSave | null> {
        return await prismaClient.hospital.findFirst({
            where:{
                id
            }, include:{
                images: {
                    select:{
                        urlImagem: true
                    }
                }
            }
        })
    }

    async findByName(name: string): Promise<hospitalSave | null> {
        return await prismaClient.hospital.findFirst({
            where:{
                name
            }, include:{
                images: {
                    select:{
                        urlImagem: true
                    }
                }
            }
        })
    }

    async findList(): Promise<hospitalSave[]> {
        return await prismaClient.hospital.findMany({
             include:{
                images: {
                    select:{
                        urlImagem: true
                    }
                }
            }
        })
    }
    async  update(id: string, data: hospitalInput, images: any): Promise<void> {
        await prismaClient.hospital.update({
            where:{
                id
            },
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email,
                images: {
                    updateMany: images
                },
                updatedAt: new Date()
            }
        })
    }

    async delete(id: string): Promise<void> {
       await prismaClient.hospital.delete({
                where:{
                    id,
                }
            })
    }
    

}