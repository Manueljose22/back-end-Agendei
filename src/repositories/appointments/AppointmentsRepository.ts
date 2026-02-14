import { prismaClient } from "../../config/prisma/prismaClient";
import { appointmentsRequest, appointmentsSave, IAppointmentsRepository } from "./IAppointmentsRepository";





export class AppointmentsRepository implements IAppointmentsRepository {

    async save({ patientId, serviceId, doctorId, bookingDate, bookingHour }: appointmentsRequest): Promise<void> {

        console.log(serviceId);
        
        await prismaClient.appointment.create({
            data: {
                patientId,
                doctorId,
                serviceId,
                bookingHour,
                bookingDate: new Date(`${bookingDate}T00:00:00Z`)

            }
        })
    }

    async findById(id: string): Promise<appointmentsSave | null> {

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
                        photo: true,
                        Specialty: {
                            select: {
                                name: true
                            }
                        },
                        Hospital: {
                            select: {
                                name: true
                            }
                        }
                    }
                }, Patient: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })


        let appointment = {
            id: appoint?.id!,
            status: appoint?.status!,
            service: appoint?.Service.title!,
            doctorname: appoint?.Doctor.name!,
            specialty: appoint?.Doctor.Specialty?.name!,
            hospitalname: appoint?.Doctor.Hospital?.name!,
            photo: appoint?.Doctor.photo || null,
            patientId: appoint?.Patient.id!,
            patientname: appoint?.Patient.name!,
            price: appoint?.Service.Doctor_Service[0].price!,
            booking_date: appoint?.bookingDate!,
            booking_hour: appoint?.bookingHour!,
            idDoctor: appoint?.Doctor.id!,
            idService: appoint?.Service.id!
        }

        return appointment;
    }

    async findAllByPatient(patientId: string): Promise<appointmentsSave[] | null> {

        let appointment: appointmentsSave[] = [];

        const allAppointment = await prismaClient.appointment.findMany({
            where: {
                patientId,
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
                        photo: true,
                        Specialty: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        Hospital: {
                            select: {
                                name: true
                            }
                        }
                    }
                }, Patient: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        })

        allAppointment.map((item) => {
            appointment.push({
                id: item.id,
                status: item.status,
                service: item.Service.title,
                doctorname: item.Doctor.name,
                specialty: item.Doctor.Specialty?.name!,
                patientname: item.Patient.name,
                patientId: item.Patient.id,
                hospitalname: item.Doctor.Hospital?.name!,
                price: item.Service.Doctor_Service[0].price,
                booking_date: item.bookingDate,
                booking_hour: item.bookingHour,
                idDoctor: item.Doctor.id,
                idService: item.Service.id,
                photo: item.Doctor.photo
            })
        })

        return appointment;
    }

    async findAll(search: string): Promise<appointmentsSave[] | null> {

        let appointment: appointmentsSave[] = [];

        if (search) {
            const allAppointment = await prismaClient.appointment.findMany({
                where: {
                    Doctor: {
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
                            photo: true,
                            Specialty: {
                                select: {
                                    name: true
                                }
                            },
                            Hospital: {
                                select: {
                                    name: true
                                }
                            }
                        },

                    }, Patient: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            })

            allAppointment.map((item) => {
                appointment.push({
                    id: item.id,
                    status: item.status,
                    service: item.Service.title,
                    doctorname: item.Doctor.name,
                    specialty: item.Doctor.Specialty?.name!,
                    patientname: item.Patient.name,
                    patientId: item.Patient.id,
                    hospitalname: item.Doctor.Hospital?.name!,
                    price: item.Service.Doctor_Service[0].price,
                    booking_date: item.bookingDate,
                    booking_hour: item.bookingHour,
                    idDoctor: item.Doctor.id,
                    idService: item.Service.id,
                    photo: item.Doctor.photo
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
                            id: true,
                            name: true,
                            photo: true,
                            Specialty: {
                                select: {
                                    name: true
                                }
                            },
                            Hospital: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }, Patient: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            })

            allAppointment.map((item) => {
                appointment.push({
                    id: item.id,
                    status: item.status,
                    service: item.Service.title,
                    doctorname: item.Doctor.name,
                    specialty: item.Doctor.Specialty?.name!,
                    patientname: item.Patient.name,
                    patientId: item.Patient.id,
                    hospitalname: item.Doctor.Hospital?.name!,
                    price: item.Service.Doctor_Service[0].price,
                    booking_date: item.bookingDate,
                    booking_hour: item.bookingHour,
                    idDoctor: item.Doctor.id,
                    idService: item.Service.id,
                    photo: item.Doctor.photo
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
                bookingDate: new Date(bookingDate),
                upadatedAt: new Date()
            }
        })
    }

    async cancel(id: string): Promise<void> {

        await prismaClient.appointment.update({
            where: {id},
            data:{status: "Cancelado"}
        })
    }
}