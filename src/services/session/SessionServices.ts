import { compare } from "bcrypt";
import { AppError } from "../../errors/AppError";
import { payloadRequest, payloadSave } from "../../repositories/sessions/ISessionsRepository";
import { SessionRepository } from "../../repositories/sessions/SessionsRepository";
import { createUsersToken } from "../../middlewares/auth/create-users-token";

class SessionServices {
    constructor(private sessionRepository: SessionRepository) {}

    async execute({ email, password }: payloadRequest): Promise<{ user: Omit<payloadSave, "password">; token: string }> {
        const user = await this.sessionRepository.findByEmail(email);
        
        if (!user || !user.password || !(await compare(password, user.password))) {
            throw new AppError("Credenciais inválidas!", 401);
        }

        const token = await createUsersToken(user);
        const { password: _password, ...safeUser } = user;

        return {
            user: safeUser,
            token,
        };
    }
}

export { SessionServices };
