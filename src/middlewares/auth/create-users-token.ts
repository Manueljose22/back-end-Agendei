import { sign } from "jsonwebtoken";
import { payloadSave } from "../../repositorys/sessions/ISessionsRepository";



export const createUsersToken = async ({id, email, password}: payloadSave) =>{

    const token = sign({
        id: id,
        email: email
    }, process.env.JwtSecret!, 
    { 
        expiresIn: '1d'
    })

    return token;
}