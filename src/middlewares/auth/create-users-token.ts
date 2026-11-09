import { sign } from "jsonwebtoken";

type UserTokenPayload = {
    id: string;
    email: string | null;
};

export const createUsersToken = async ({ id, email }: UserTokenPayload): Promise<string> => {
    const secret = process.env.JwtSecret;

    if (!secret) {
        throw new Error("A variável JwtSecret não está configurada.");
    }

    return sign(
        { id, email },
        secret,
        { expiresIn: "1d" }
    );
};