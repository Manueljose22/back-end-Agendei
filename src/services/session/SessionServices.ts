import { compare } from "bcrypt";
import { payloadRequest, payloadSave } from "../../repositories/sessions/ISessionsRepository";
import { SessionRepository } from "../../repositories/sessions/SessionsRepository";
import { createUsersToken } from "../../middlewares/auth/create-users-token";




class SessionServices {

    constructor(private ISessionRepository: SessionRepository) { }

    async execute({email, password}: payloadRequest): Promise<{user: payloadSave, token: string} | Error> {

        const user = await this.ISessionRepository.findByEmail(email)

        if (email != user?.email && !await compare(password, user!.password)) {
            throw new Error("Credenciais inválidas!");
        }  

        const token = await createUsersToken(user);
        
        user!.password = ''

        return {
            user: user!,
            token: token
        }
    }
}

export { SessionServices };