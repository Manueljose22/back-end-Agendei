import { IAvailabilityInput, ITimetablesRepository } from "./ITimetablesRepository";



export class TimetablesRepository  implements ITimetablesRepository {
    
    async generateHours(availabilityId: string, intervalMinutes: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    async createAvailability(data: IAvailabilityInput): Promise<void> {
        
        throw new Error("Method not implemented.");
    }   
}