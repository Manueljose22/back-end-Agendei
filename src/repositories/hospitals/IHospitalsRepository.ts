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

export type hospitalUpdate = Partial<
    Pick<hospitalSave, "name" | "address" | "phone" | "email">
>;

export interface IHospitalsRepository {
    create(data: hospitalInput, images?: string[]): Promise<void>;
    findById(id: string): Promise<hospitalSave | null>;
    findByName(name: string): Promise<hospitalSave | null>;
    findList(): Promise<hospitalSave[]>;
    findSearch(search: string): Promise<hospitalSave[] | null>;
    delete(id: string): Promise<string[]>;
    update(id: string, data: hospitalUpdate, images?: string[]): Promise<string[]>;
}