

export type IAvailabilityInput = {
    doctor_id: string;
    date: Date;
    hourStart: Date;
    hourEnd: Date;
}

export type IAvailability = {
    id: string;
    data: Date;
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
    generateHours(availabilityId: string, hour: Date): Promise<void>;
    getAvailabilityByDate(doctorId: string): Promise<IAvailability[]>
    
}