import { prismaClient } from "../../db/prismaClient";
import { appointmentsRequest, appointmentsSave, IAppointmentsRepository } from "./IAppointmentsRepository";





export class AppointmentsRepository implements IAppointmentsRepository {

    async save({ userId, serviceId, doctorId, bookingDate, bookingHour }: appointmentsRequest): Promise<void> {
        
        await prismaClient.appointment.create({
            data: {
                userId,
                doctorId,
                serviceId,
                bookingHour,
                bookingDate: new Date(bookingDate)
                
            }
        })
    }

    async findById(id: string): Promise<any | null> {

        const appoint = await prismaClient.appointment.findFirst({
            where: {
                id
            }, include: {
                Service: {
                    select: {
                        id: true,
                        title: true,
                        Doctor_Service: {
                            select: {
                                price: true
                            }
                        }
                    }
                },
                Doctor: {
                    select: {
                        id: true,
                        name: true,
                        especialty: true
                    }
                }, User: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })


        let appointment = {
            id: appoint?.id,
            service: appoint?.Service.title,
            doctor: appoint?.Doctor.name,
            specialty: appoint?.Doctor.especialty,
            userId: appoint?.User.id,
            username: appoint?.User.name,
            price: appoint?.Service.Doctor_Service[0].price,
            booking_date: appoint?.bookingDate,
            booking_hour: appoint?.bookingHour,
            idDoctor: appoint?.Doctor.id,
            idService: appoint?.Service.id
        }

        return appointment;
    }

    async findAllByUser(userId: string): Promise<appointmentsSave[] | null> {

        let appointment: appointmentsSave[] = [];

        const allAppointment = await prismaClient.appointment.findMany({
            where: {
                userId
            }, include: {
                Service: {
                    select: {
                        id: true,
                        title: true,
                        Doctor_Service: {
                            select: {
                                price: true
                            }
                        }
                    }
                },
                Doctor: {
                    select: {
                        id: true,
                        name: true,
                        especialty: true
                    }
                }, User: {
                    select: {
                        name: true
                    }
                }
            }
        })

        allAppointment.map((item) => {
            appointment.push({
                id: item.id,
                service: item.Service.title,
                doctor: item.Doctor.name,
                specialty: item.Doctor.especialty,
                username: item.User.name,
                price: item.Service.Doctor_Service[0].price,
                booking_date: item.bookingDate,
                booking_hour: item.bookingHour,
                idDoctor: item.Doctor.id,
                idService: item.Service.id
            })
        })

        return appointment;
    }

    async findAll(search: string): Promise<appointmentsSave[] | null> {

        let appointment: appointmentsSave[] = [];
        
        if (search) {
            const allAppointment = await prismaClient.appointment.findMany({
                where:{
                    Doctor:{
                        id: {
                            contains: search
                        }
                    }
                },
                include: {
                    Service: {
                        select: {
                            id: true,
                            title: true,
                            Doctor_Service: {
                                select: {
                                    price: true
                                }
                            }
                        }
                    },
                    Doctor: {
                        select: {
                            id: true,
                            name: true,
                            especialty: true
                        }
                    }, User: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            allAppointment.map((item) => {
                appointment.push({
                    id: item.id,
                    service: item.Service.title,
                    doctor: item.Doctor.name,
                    specialty: item.Doctor.especialty,
                    username: item.User.name,
                    price: item.Service.Doctor_Service[0].price,
                    booking_date: item.bookingDate,
                    booking_hour: item.bookingHour,
                    idDoctor: item?.Doctor.id,
                    idService: item?.Service.id
                })
            })

            return appointment;
        } else {

            const allAppointment = await prismaClient.appointment.findMany({
                include: {
                    Service: {
                        select: {
                            id: true,
                            title: true,
                            Doctor_Service: {
                                select: {
                                    price: true
                                }
                            }
                        }
                    },
                    Doctor: {
                        select: {
                            id:true,
                            name: true,
                            especialty: true
                        }
                    }, User: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            allAppointment.map((item) => {
                appointment.push({
                    id: item.id,
                    service: item.Service.title,
                    doctor: item.Doctor.name,
                    specialty: item.Doctor.especialty,
                    username: item.User.name,
                    price: item.Service.Doctor_Service[0].price,
                    booking_date: item.bookingDate,
                    booking_hour: item.bookingHour,
                    idDoctor: item.Doctor.id,
                    idService: item.Service.id
                })
            })

            return appointment;
        }
    }

    async update(id: string, { bookingDate, bookingHour, serviceId }: Pick<appointmentsRequest, 'bookingDate' | 'bookingHour' | 'serviceId'>): Promise<void> {
        await prismaClient.appointment.update({
            where: {
                id
            },
            data: {
                serviceId,
                bookingHour,
                bookingDate:new Date(bookingDate) ,
                upadatedAt: new Date()
            }
        })
    }

    async delete(id: string): Promise<void> {

        await prismaClient.appointment.delete({
            where: {
                id
            }
        })
    }
}