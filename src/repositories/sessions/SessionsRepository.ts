import { prismaClient } from "../../config/prisma/prismaClient";
import { ISessionRepository, payloadSave } from "./ISessionsRepository";




export class SessionRepository implements ISessionRepository {
    
    async findByEmail(email: string): Promise<payloadSave | null> {
        
        const userPatient = await prismaClient.patient.findFirst({
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

        const userHospitails = await prismaClient.hospital.findFirst({
            where: {
                email
            },
             select:{
                id: true,
                name: true,
                email: true,
                password: true
            }
        })

        return userPatient ?? userAdmin ?? userHospitails;
    }
    
}