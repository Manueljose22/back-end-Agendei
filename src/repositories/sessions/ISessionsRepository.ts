export type AccountRole = "platform_admin" | "hospital" | "doctor" | "patient";

export type payloadRequest = {
    email: string;
    password: string;
};

export type payloadSave = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: AccountRole;
};

export interface ISessionRepository {
    findByEmail(email: string): Promise<payloadSave | null>;
}
