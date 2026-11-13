import { NextFunction, Request, Response } from "express";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { ensuredAuthenticated } from "./ensuredAuthenticated";

/**
 * RBAC: permite executar a rota apenas aos perfis explicitamente autorizados.
 * A autenticação é sempre validada antes de avaliar o papel.
 */
export const ensureRole = (...allowedRoles: AccountRole[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
        return ensuredAuthenticated(request, response, (error?: unknown) => {
            if (error) return next(error);

            if (!allowedRoles.includes(request.userRole)) {
                return response.status(403).json({
                    message: "Não tem permissões para executar esta operação."
                });
            }

            return next();
        });
    };
};
