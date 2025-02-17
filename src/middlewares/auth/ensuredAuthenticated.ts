import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";



type JWTPayload = {
    id: string;
    iat: number;
    exp: number
}



export const ensuredAuthenticated =  (request: Request, response: Response, next: NextFunction) => {

    const authHeaders = request.headers.authorization;

    if (!authHeaders) {
        return response.status(401).json({ message: 'Acesso negado' });
    }

    const token = authHeaders?.split(' ')[1];
    
    try {

        const { id } = verify(token, process.env.JwtSecret!) as JWTPayload;
        
        request.userId = id;
        
        next()

    } catch (error: any) {
        return response.status(400).json({ message: 'Token inválido!' });
    }
}