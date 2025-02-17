import { prismaClient } from "../../db/prismaClient";
import { IClientsRepository, clientsRequest, clientsSave } from "./IClientsRepository";





export class ClientsRepository implements IClientsRepository {
    
    
    async save({ name, email, password }: clientsRequest): Promise<clientsSave> {
       return await prismaClient.user.create({
            data: {
                name,
                email,
                password
            }
        })

    }

    async findByName(name: string): Promise<clientsSave | null> {
        
        return await prismaClient.user.findFirst({
            where: {
                name
            }
        })
    }
    async findByEmail(email: string): Promise<clientsSave | null> {
        
        return await prismaClient.user.findFirst({
            where: {
                email
            }
        })
    }

    async findById(id: string): Promise<clientsSave | null> {
        return await prismaClient.user.findFirst({
            where: {
                id
            }
        })
    }

    async findAll(search: string): Promise<clientsSave[] | null> {
        
        let users;
        if (search) {
            users = await prismaClient.user.findMany({
                where:{
                    name:{
                        contains: search
                    }
                }
            });
        } else{
            users = await prismaClient.user.findMany();
        }

        return users
    }

    async findSearch(search: string): Promise<clientsSave[] | null> {
        return await prismaClient.user.findMany({
           where:{
            name: {
                contains: search
            }
           } 
        })
    }

    async update(id: string, { name, email, password }: clientsRequest): Promise<void> {
        await prismaClient.user.update({
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
        await prismaClient.user.delete({
            where: {
                id
            }
        })
    }

}