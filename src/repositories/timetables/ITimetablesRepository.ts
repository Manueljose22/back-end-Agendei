

export type IAvailabilityInput = {
    doctor_id: string;
    date: Date;
    hourStart: Date;
    hourEnd: Date;
}

export type IAvailability = {
    id: string;
    doctorId: string;
    date: Date;
    hourStart: Date;
    hourEnd: Date;
    isBlocked: boolean;
    createdAt: Date;
    timetables: {
        id: string;
        hour: Date;
        isBooked: boolean;
    }[]
}




export type IUpdateAvailability = {
    hourStart: Date;
    hourEnd: Date;
}

export type ITimeTablesInput = {
    availabilityId: string;
    hour: Date;
    available: boolean;
}



export interface ITimetablesRepository {
    createAvailability(data: IAvailabilityInput): Promise<void>;
    generateHours(availabilityId: string, hourStart: string, hourEnd: string): Promise<void>;
    getAvailabilityByDoctor(doctorId: string): Promise<IAvailability[]>;
    getAvailabilityByDate(doctorId: string, date: string): Promise<IAvailability[]>;
    updateAvailability(id: string, data: IUpdateAvailability): Promise<void>;
    blockDay(id: string): Promise<void>;
    unblockDay(id: string): Promise<void>;
    deleteAvailability(id: string): Promise<void>;
    bookHour(timetableId: string): Promise<void>;
    unbookHour(timetableId: string): Promise<void>;
}
