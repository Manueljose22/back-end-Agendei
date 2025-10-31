import { prismaClient } from "../../config/prisma/prismaClient";
import { IAdminRepository, adminRequest, adminSave } from "./IAdminRepository";





export class AdminRepository implements IAdminRepository {
    
    
    async save({ name, email, password }: adminRequest): Promise<adminSave> {
       return await prismaClient.admin.create({
            data: {
                name,
                email,
                password
            }
        })

    }

    async findByName(name: string): Promise<adminSave | null> {
        
        return await prismaClient.admin.findFirst({
            where: {
                name
            }
        })
    }
    async findByEmail(email: string): Promise<adminSave | null> {
        
        return await prismaClient.admin.findFirst({
            where: {
                email
            }
        })
    }

    async findById(id: string): Promise<adminSave | null> {
        return await prismaClient.admin.findFirst({
            where: {
                id
            }
        })
    }

    async findAll(search: string): Promise<adminSave[] | null> {
        
        let users;
        if (search) {
            users = await prismaClient.admin.findMany({
                where:{
                    name:{
                        contains: search
                    }
                }
            });
        } else{
            users = await prismaClient.admin.findMany();
        }

        return users
    }

    async findSearch(search: string): Promise<adminSave[] | null> {
        return await prismaClient.admin.findMany({
           where:{
            name: {
                contains: search
            }
           } 
        })
    }

    async update(id: string, { name, email, password }: adminRequest): Promise<void> {
        await prismaClient.admin.update({
            where: {
                id
            },
            data: {
                name,
                email,
                password,
                updatedAt: new Date()
            }
        })

    }


    async delete(id: string): Promise<void> {
        await prismaClient.admin.delete({
            where: {
                id
            }
        })
    }

}