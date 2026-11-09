import { compare } from "bcrypt";
import { payloadRequest, payloadSave } from "../../repositories/sessions/ISessionsRepository";
import { SessionRepository } from "../../repositories/sessions/SessionsRepository";
import { createUsersToken } from "../../middlewares/auth/create-users-token";

class SessionServices {
    constructor(private sessionRepository: SessionRepository) {}

    async execute({ email, password }: payloadRequest): Promise<{ user: payloadSave; token: string }> {
        const user = await this.sessionRepository.findByEmail(email);

        if (!user || !user.password || !(await compare(password, user.password))) {
            throw new Error("Credenciais inválidas!");
        }

        const token = await createUsersToken(user);

        return {
            user: { ...user, password: "" },
            token,
        };
    }
}

export { SessionServices };