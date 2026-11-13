import { HospitalStatus, RoleHospitals } from "@prisma/client";

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
    role: RoleHospitals;
    status: HospitalStatus;
    images: { urlImagem: string }[];
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
    findList(includeSuspended?: boolean): Promise<hospitalSave[]>;
    findSearch(search: string, hospitalId?: string, includeSuspended?: boolean): Promise<hospitalSave[] | null>;
    updateStatus(id: string, status: HospitalStatus): Promise<hospitalSave>;
    delete(id: string): Promise<string[]>;
    update(id: string, data: hospitalUpdate, images?: string[]): Promise<string[]>;
}
