import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../../config/prisma/prismaClient";
import { ensuredAuthenticated } from "./ensuredAuthenticated";

export const ensureAdminAuthenticated = (request: Request, response: Response, next: NextFunction) => {
    return ensuredAuthenticated(request, response, async (error?: unknown) => {
        if (error) return next(error);
        try {
            const admin = await prismaClient.admin.findUnique({ where: { id: request.userId }, select: { id: true } });
            if (!admin) return response.status(403).json({ message: "Acesso restrito a administradores." });
            return next();
        } catch (error) {
            return next(error);
        }
    });
};
