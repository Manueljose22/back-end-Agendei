import { RoleHospitals } from "@prisma/client";

export type hospitalInput = {
    name: string;
    address: string;
    phone: string;
    email: string;
    nif: string;
    password: string;
    role: RoleHospitals
    
}

export type hospitalSave = {
    id: string;
    name: string;
    address: string;
    nif: string;
    phone: string | null;
    email: string | null;
    role: RoleHospitals
    images: {
        urlImagem: string
    }[];
    createdAt: Date; 
    updatedAt: Date
}


export interface IHospitalsRepository {
    create(data:hospitalInput): Promise<void>;
    // create(data:hospitalInput, images: any): Promise<void>;
    findById(id: string): Promise<hospitalSave | null>;
    findByName(name: string): Promise<hospitalSave | null>;
    findList(): Promise<hospitalSave[]>;
    findSearch(search: string): Promise<hospitalSave[] | null>
    delete(id: string): Promise<void>;
    update(id: string, data: hospitalInput, images: any): Promise<void>
}