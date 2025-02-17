import { compare } from "bcrypt";
import { payloadRequest, payloadSave } from "../../repositorys/sessions/ISessionsRepository";
import { SessionRepository } from "../../repositorys/sessions/SessionsRepository";
import { createUsersToken } from "../../middlewares/auth/create-users-token";




class SessionServices {

    constructor(private ISessionRepository: SessionRepository) { }

    async execute({email, password}: payloadRequest): Promise<{user: payloadSave, token: string} | Error> {

        const user = await this.ISessionRepository.findByEmail(email)

        if (email != user?.email) {
            throw new Error('Email inválido, por favor tente novamente!');
        }  else if(!await compare(password, user.password) ) {
            throw new Error('Senha inválida, por favor tente novamente!');
        }

        const token = await createUsersToken(user);
        
        user.password = ''

        return {
            user: user,
            token: token
        }
    }
}

export { SessionServices };