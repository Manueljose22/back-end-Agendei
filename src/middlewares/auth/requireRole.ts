import { NextFunction, Request, Response } from "express";

type RequestWithRole = Request & { userRole?: string };

export const requireRole = (...allowedRoles: string[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
        const role = (request as RequestWithRole).userRole;
        if (!role || !allowedRoles.includes(role)) {
            return response.status(403).json({ message: "Não tem permissões para aceder a este recurso." });
        }
        return next();
    };
};
