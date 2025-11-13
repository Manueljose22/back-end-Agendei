



export type appointmentsRequest = {
    patientId: string;
    serviceId: string;
    doctorId: string;
    bookingDate: string;
    bookingHour: string;
}

export type appointmentsSave = {
    id: string;
    service: string;
    doctor: string;
    specialty: string;
    patientname: string;
    patientId: string
    price: number;
    status: string;
    hospitalname: string;
    booking_date: Date;
    booking_hour: string;
    idDoctor: string;
    idService: string;
    photo: string | null;
}


export interface IAppointmentsRepository {
    save({patientId, serviceId, doctorId, bookingDate, bookingHour}: appointmentsRequest): Promise<void>
    findAllByPatient(userId: string): Promise<appointmentsSave[] | null>
    findById(id: string): Promise<appointmentsSave | null>
    findAll(search: string): Promise<appointmentsSave[] | null>
    update(id: string, data: Pick<appointmentsRequest, 'serviceId' | 'bookingDate' | 'bookingHour'>): Promise<void | null>
    cancel(id: string): Promise<void>
 }