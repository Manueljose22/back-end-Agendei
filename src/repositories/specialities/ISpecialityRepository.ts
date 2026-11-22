export type specialityInput = {
    name: string;
    hospitalId: string;
    description: string;
    color: string;
};

export type specialitySaved = {
    id: string;
    name: string;
    hospitalId: string;
    description: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
} | null;

export interface ISpecialityRepository {
    create(data: specialityInput): Promise<specialitySaved>;
    findById(id: string, hospitalId?: string): Promise<specialitySaved>;
    findByHospitails(id: string): Promise<specialitySaved[]>;
    findByName(name: string): Promise<specialitySaved>;
    findAll(): Promise<specialitySaved[] | null>;
    findSearch(search: string): Promise<specialitySaved[] | null>;
    update(id: string, data: Omit<specialityInput, "hospitalId">, hospitalId: string): Promise<boolean>;
    delete(id: string, hospitalId: string): Promise<boolean>;
}
