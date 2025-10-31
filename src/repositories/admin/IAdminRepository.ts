

export type adminRequest = {
  name: string;
  email: string;
  password: string;
}


export type adminSave = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}



export interface IAdminRepository {
    save(data: adminRequest): Promise<adminSave>
    findByName(name: string): Promise<adminSave | null>
    findByEmail(email: string): Promise<adminSave | null>
    findById(id: string): Promise<adminSave | null>
    findAll(search: string): Promise<adminSave[] | null>
    findSearch(search: string): Promise<adminSave[] | null>
    update(id: string, data: adminRequest): Promise<void | null>
    delete(id: string): Promise<void>
}