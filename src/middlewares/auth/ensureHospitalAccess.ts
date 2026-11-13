import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../../config/prisma/prismaClient";
import { ensuredAuthenticated } from "./ensuredAuthenticated";

/**
 * Permite consultar o directório de hospitais a perfis autenticados.
 * Uma conta hospitalar fica limitada ao seu próprio registo.
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

            if (hospital) {
                request.hospitalId = hospital.id;
                request.isPlatformAdmin = false;

                const requestedHospitalId = request.params.id;

                if (requestedHospitalId && requestedHospitalId !== hospital.id) {
                    return response.status(403).json({
                        message: "Não tem permissão para aceder aos dados deste hospital."
                    });
                }

                return next();
            }

            const [patient, doctor] = await Promise.all([
                prismaClient.patient.findUnique({
                    where: { id: request.userId },
                    select: { id: true }
                }),
                prismaClient.doctor.findUnique({
                    where: { id: request.userId },
                    select: { id: true }
                })
            ]);

            if (!patient && !doctor) {
                return response.status(403).json({
                    message: "O perfil autenticado não tem permissão para consultar hospitais."
                });
            }

            request.isPlatformAdmin = false;
            return next();
        } catch (error) {
            return next(error);
        }
    });
};

/**
 * Escrita e gestão de hospitais: apenas administrador global ou o próprio hospital.
 */
export const ensureHospitalManagementAccess = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    return ensureHospitalAccess(request, response, (error?: unknown) => {
        if (error) return next(error);

        if (request.isPlatformAdmin || request.hospitalId) {
            return next();
        }

        return response.status(403).json({
            message: "Apenas o administrador da plataforma ou o próprio hospital pode efectuar esta operação."
        });
    });
};
