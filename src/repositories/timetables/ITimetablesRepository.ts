

export type IAvailabilityInput = {
    id: string;
    doctor_id: string;
    date: Date;
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
    generateHours(availabilityId: string, intervalMinutes: number): Promise<void>;
    
}