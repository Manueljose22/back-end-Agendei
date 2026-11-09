import { sign } from "jsonwebtoken";
import { payloadSave } from "../../repositories/sessions/ISessionsRepository";

export const createUsersToken = async ({ id, email }: Pick<payloadSave, "id" | "email">): Promise<string> => {
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