import { prismaClient } from "../../db/prismaClient";
import { ISessionRepository, payloadSave } from "./ISessionsRepository";




export class SessionRepository implements ISessionRepository {
    
    async findByEmail(email: string): Promise<payloadSave | null> {
        
        const user = await prismaClient.user.findFirst({
            where:{
                email
            }, select:{
                id: true,
                name: true,
                email: true,
                password: true
            }
        })

        const userAdmin = await prismaClient.admin.findFirst({
            where:{
                email
            }, select:{
                id: true,
                name: true,
                email: true,
                password: true
            }
        })

        return user ?? userAdmin;
    }
    
}