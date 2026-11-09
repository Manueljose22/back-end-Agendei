export type adminRequest = {
    name: string;
    email: string;
};

export type adminUpdate = {
    name?: string;
    email?: string;
};

export type adminSave = {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface IAdminRepository {
    findByName(name: string): Promise<adminSave | null>;
    findByEmail(email: string): Promise<adminSave | null>;
    findById(id: string): Promise<adminSave | null>;
    findAll(search: string): Promise<adminSave[]>;
    findSearch(search: string): Promise<adminSave[]>;
    update(id: string, data: adminUpdate): Promise<void>;
    delete(id: string): Promise<void>;
}
