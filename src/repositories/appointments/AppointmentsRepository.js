"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsRepository = void 0;
const prismaClient_1 = require("../../config/prisma/prismaClient");
class AppointmentsRepository {
    async save({ patientId, serviceId, doctorId, bookingDate, bookingHour }) {
        console.log(serviceId);
        await prismaClient_1.prismaClient.appointment.create({
            data: {
                patientId,
                doctorId,
                serviceId,
                bookingHour,
                bookingDate: new Date(`${bookingDate}T00:00:00Z`)
            }
        });
    }
    async findById(id) {
        const appoint = await prismaClient_1.prismaClient.appointment.findFirst({
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
        });
        let appointment = {
            id: appoint?.id,
            status: appoint?.status,
            service: appoint?.Service.title,
            doctorname: appoint?.Doctor.name,
            specialty: appoint?.Doctor.Specialty?.name,
            hospitalname: appoint?.Doctor.Hospital?.name,
            photo: appoint?.Doctor.photo || null,
            patientId: appoint?.Patient.id,
            patientname: appoint?.Patient.name,
            price: appoint?.Service.Doctor_Service[0].price,
            booking_date: appoint?.bookingDate,
            booking_hour: appoint?.bookingHour,
            idDoctor: appoint?.Doctor.id,
            idService: appoint?.Service.id
        };
        return appointment;
    }
    async findAllByPatient(patientId) {
        let appointment = [];
        const allAppointment = await prismaClient_1.prismaClient.appointment.findMany({
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
        });
        allAppointment.map((item) => {
            appointment.push({
                id: item.id,
                status: item.status,
                service: item.Service.title,
                doctorname: item.Doctor.name,
                specialty: item.Doctor.Specialty?.name,
                patientname: item.Patient.name,
                patientId: item.Patient.id,
                hospitalname: item.Doctor.Hospital?.name,
                price: item.Service.Doctor_Service[0].price,
                booking_date: item.bookingDate,
                booking_hour: item.bookingHour,
                idDoctor: item.Doctor.id,
                idService: item.Service.id,
                photo: item.Doctor.photo
            });
        });
        return appointment;
    }
    async findAll(search) {
        let appointment = [];
        if (search) {
            const allAppointment = await prismaClient_1.prismaClient.appointment.findMany({
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
            });
            allAppointment.map((item) => {
                appointment.push({
                    id: item.id,
                    status: item.status,
                    service: item.Service.title,
                    doctorname: item.Doctor.name,
                    specialty: item.Doctor.Specialty?.name,
                    patientname: item.Patient.name,
                    patientId: item.Patient.id,
                    hospitalname: item.Doctor.Hospital?.name,
                    price: item.Service.Doctor_Service[0].price,
                    booking_date: item.bookingDate,
                    booking_hour: item.bookingHour,
                    idDoctor: item.Doctor.id,
                    idService: item.Service.id,
                    photo: item.Doctor.photo
                });
            });
            return appointment;
        }
        else {
            const allAppointment = await prismaClient_1.prismaClient.appointment.findMany({
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
            });
            allAppointment.map((item) => {
                appointment.push({
                    id: item.id,
                    status: item.status,
                    service: item.Service.title,
                    doctorname: item.Doctor.name,
                    specialty: item.Doctor.Specialty?.name,
                    patientname: item.Patient.name,
                    patientId: item.Patient.id,
                    hospitalname: item.Doctor.Hospital?.name,
                    price: item.Service.Doctor_Service[0].price,
                    booking_date: item.bookingDate,
                    booking_hour: item.bookingHour,
                    idDoctor: item.Doctor.id,
                    idService: item.Service.id,
                    photo: item.Doctor.photo
                });
            });
            return appointment;
        }
    }
    async update(id, { bookingDate, bookingHour, serviceId }) {
        await prismaClient_1.prismaClient.appointment.update({
            where: {
                id
            },
            data: {
                serviceId,
                bookingHour,
                bookingDate: new Date(bookingDate),
                upadatedAt: new Date()
            }
        });
    }
    async cancel(id) {
        await prismaClient_1.prismaClient.appointment.update({
            where: { id },
            data: { status: "Cancelado" }
        });
    }
}
exports.AppointmentsRepository = AppointmentsRepository;
