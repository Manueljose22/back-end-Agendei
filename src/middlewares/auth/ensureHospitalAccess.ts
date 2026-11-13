import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../../config/prisma/prismaClient";
import { ensuredAuthenticated } from "./ensuredAuthenticated";

/**
 * Permite acesso ao administrador global ou ao próprio hospital autenticado.
 * Em rotas com :id, um hospital não pode consultar nem alterar outro registo.
 */
export const ensureHospitalAccess = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    return ensuredAuthenticated(request, response, async (error?: unknown) => {
        if (error) return next(error);

        try {
            const admin = await prismaClient.admin.findUnique({
                where: { id: request.userId },
                select: { id: true }
            });

            if (admin) {
                request.isPlatformAdmin = true;
                return next();
            }

            const hospital = await prismaClient.hospital.findUnique({
                where: { id: request.userId },
                select: { id: true }
            });

            if (!hospital) {
                return response.status(403).json({
                    message: "Acesso restrito a contas de hospitais ou ao administrador da plataforma."
                });
            }

            request.hospitalId = hospital.id;
            request.isPlatformAdmin = false;

            const requestedHospitalId = request.params.id;

            if (requestedHospitalId && requestedHospitalId !== hospital.id) {
                return response.status(403).json({
                    message: "Não tem permissão para aceder aos dados deste hospital."
                });
            }

            return next();
        } catch (error) {
            return next(error);
        }
    });
};
