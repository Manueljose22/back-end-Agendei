declare namespace Express {
    export interface Request {
        userId: string;
        hospitalId?: string;
        isPlatformAdmin?: boolean;
    }
}
