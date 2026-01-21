
export type hospitalInput = {
    name: string;
    address: string;
    phone: string;
    email: string;
    nif: string;
    password: string;
    
}

export type hospitalSave = {
    id: string;
    name: string;
    address: string;
    nif: string;
    password: string;
    phone: string | null;
    email: string | null;
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
    delete(id: string): Promise<void>;
    update(id: string, data: hospitalInput, images: any): Promise<void>
}