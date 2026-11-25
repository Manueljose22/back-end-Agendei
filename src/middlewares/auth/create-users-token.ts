import { sign } from "jsonwebtoken";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";

type UserTokenPayload = {
    id: string;
    email: string | null;
    role: AccountRole;
    tokenVersion?: number;
};

export const createUsersToken = async ({ id, email, role, tokenVersion }: UserTokenPayload): Promise<string> => {
    const secret = process.env.JwtSecret;

    if (!secret) {
        throw new Error("A variável JwtSecret não está configurada.");
    }

    return sign(
        { id, email, role, ...(role === "patient" ? { tokenVersion: tokenVersion ?? 0 } : {}) },
        secret,
        { expiresIn: "1d" }
    );
};
