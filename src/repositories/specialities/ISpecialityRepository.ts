



export type specialityInput = {
    name: string
    hospitalId: string;
    description: string;
    color: string;
}

export type specialitySaved = {
    id: string
    name: string
    hospitalId: string;
    description: string;
    color: string;
    createdAt: Date
    updatedAt: Date
} | null;


export interface ISpecialityRepository{
    create(data: specialityInput): Promise<specialitySaved>;
    findById(id: string): Promise<specialitySaved>;
    findByHospitails(id: string): Promise<specialitySaved[]>;
    findByName(name: string): Promise<specialitySaved>;
    findAll(): Promise<specialitySaved[] | null>;
    update(id: string, data: Omit<specialityInput, "hospitalId">): Promise<void>;
    delete(id: string): Promise<void>;
}