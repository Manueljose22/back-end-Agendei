



export type appointmentsRequest = {
    userId: string;
    serviceId: string;
    doctorId: string;
    bookingDate: Date;
    bookingHour: string;
}

export type appointmentsSave = {
    id: string;
    service: string;
    doctor: string;
    specialty: string;
    username: string;
    price: number;
    booking_date: Date;
    booking_hour: string;
    idDoctor: string;
    idService: string;
}


export interface IAppointmentsRepository {
    save({userId, serviceId, doctorId, bookingDate, bookingHour}: appointmentsRequest): Promise<void>
    findAllByUser(userId: string): Promise<appointmentsSave[] | null>
    findById(id: string): Promise<appointmentsSave | null>
    findAll(search: string): Promise<appointmentsSave[] | null>
    update(id: string, data: Pick<appointmentsRequest, 'serviceId' | 'bookingDate' | 'bookingHour'>): Promise<void | null>
    delete(id: string): Promise<void>
 }