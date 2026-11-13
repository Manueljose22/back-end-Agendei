import { AccountRole } from "../repositories/sessions/ISessionsRepository";

declare global {
    namespace Express {
        interface Request {
            userId: string;
            userRole: AccountRole;
            hospitalId?: string;
            isPlatformAdmin?: boolean;
        }
    }
}

export {};
