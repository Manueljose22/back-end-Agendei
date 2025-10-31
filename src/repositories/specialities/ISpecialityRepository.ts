



export type specialityInput = {
    name: string
}

export type specialitySaved = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
} | null;


export interface ISpecialityRepository{
    create(data: specialityInput): Promise<specialitySaved>;
    findById(id: string): Promise<specialitySaved>;
    findByName(name: string): Promise<specialitySaved>;
    findAll(): Promise<specialitySaved[] | null>;
    update(id: string, data: specialityInput): Promise<void>;
    delete(id: string): Promise<void>;
}