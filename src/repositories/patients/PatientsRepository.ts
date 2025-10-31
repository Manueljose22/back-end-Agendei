
import { prismaClient } from "../../config/prisma/prismaClient";
import { IPatientsRepository, patientsRequest, patientsSave } from "./IPatientsRepository";




export class PatientsRepository implements IPatientsRepository {

    async updatePassword(id: string, password: string): Promise<void> {
        await prismaClient.patient.update({
            where: {
                id
            },
            data: {
                password
            }
        })
    }


    async save(data: patientsRequest): Promise<patientsSave> {

        return await prismaClient.patient.create({
            data: data
        })

    }

    async findByName(name: string): Promise<patientsSave | null> {

        return await prismaClient.patient.findFirst({
            where: {
                name
            }
        })
    }

    async findByEmail(email: string): Promise<patientsSave | null> {

        return await prismaClient.patient.findFirst({
            where: {
                email
            }
        })
    }

    async findById(id: string): Promise<patientsSave | null> {
        return await prismaClient.patient.findFirst({
            where: {
                id,
            }
        })
    }

    async findAll(search: string): Promise<patientsSave[] | null> {

        let patients;
        if (search) {
            patients = await prismaClient.patient.findMany({
                where: {
                    name: {
                        contains: search
                    }
                }
            });
        } else {
            patients = await prismaClient.patient.findMany();
        }

        return patients
    }

    async findSearch(search: string): Promise<patientsSave[] | null> {
        return await prismaClient.patient.findMany({
            where: {
                name: {
                    contains: search
                }
            }
        })
    }

    async update(id: string, { name, email, password, address, dateBirth, gender, phone, photo }: patientsRequest): Promise<patientsSave> {
        return await prismaClient.patient.update({
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
        })

    }


    async delete(id: string): Promise<void> {
        await prismaClient.patient.delete({
            where: {
                id
            }
        })
    }

}