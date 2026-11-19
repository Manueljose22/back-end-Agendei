import { NextFunction, Request, Response } from "express";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { ensuredAuthenticated } from "./ensuredAuthenticated";
import { AppError } from "../../errors/AppError";

/**
 * RBAC: permite executar a rota apenas aos perfis explicitamente autorizados.
 * A autenticação é sempre validada antes de avaliar o papel.
 */
export const ensureRole = (...allowedRoles: AccountRole[]) => {
    return (request: Request, _response: Response, next: NextFunction) => {
        return ensuredAuthenticated(request, response, (error?: unknown) => {
            if (error) return next(error);

            if (!allowedRoles.includes(request.userRole)) {
                return next(new AppError("Não tem permissões para executar esta operação.", 403));
            }

            return next();
        });
    };
};
