import { sign } from "jsonwebtoken";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";

type UserTokenPayload = {
    id: string;
    email: string | null;
    role: AccountRole;
};

export const createUsersToken = async ({ id, email, role }: UserTokenPayload): Promise<string> => {
    const secret = process.env.JwtSecret;

    if (!secret) {
        throw new Error("A variável JwtSecret não está configurada.");
    }

    return sign(
        { id, email, role },
        secret,
        { expiresIn: "1d" }
    );
};
