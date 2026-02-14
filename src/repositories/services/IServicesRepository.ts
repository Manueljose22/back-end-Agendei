
export type servicesRequest = {
    title: string;
    description: string | null;
    status: string;
    duraction: string | null;
    specialtyId: string | null
    price: number;


}

export type servicesSaved = {
    id: string;
    title: string;
    description: string | null;
    status: string;
    duraction: string | null;
    specialtyId: string | null
    price: number;
    specialty: {
        name: string;
        id: string;
    } | null
    createdAt: Date;
    updatedAt: Date

}



export interface IServicesRepository {
    save(data: servicesRequest): Promise<void>
    findById(id: string): Promise<servicesSaved | null>
    findByName(name: string): Promise<servicesSaved | null>
    findAll(): Promise<servicesSaved[] | null>
    findAllHospital(hospitalId: string): Promise<servicesSaved[] | null>
    update(id: string, data: servicesRequest): Promise<void>
    delete(id: string): Promise<void>
}