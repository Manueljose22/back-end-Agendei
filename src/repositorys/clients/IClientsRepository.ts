

export type clientsRequest = {
  name: string;
  email: string;
  password: string;
}


export type clientsSave = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}



export interface IClientsRepository {
    save(data: clientsRequest): Promise<clientsSave>
    findByName(name: string): Promise<clientsSave | null>
    findByEmail(email: string): Promise<clientsSave | null>
    findById(id: string): Promise<clientsSave | null>
    findAll(search: string): Promise<clientsSave[] | null>
    findSearch(search: string): Promise<clientsSave[] | null>
    update(id: string, data: clientsRequest): Promise<void | null>
    delete(id: string): Promise<void>
}