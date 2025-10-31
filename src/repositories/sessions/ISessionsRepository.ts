

export type payloadRequest = {
    email: string;
    password: string;
}

export type payloadSave = {
    id: string;
    name:string;
    email: string;
    password: string;
}


export interface ISessionRepository {
    findByEmail(email: string): Promise<payloadSave | null>
}