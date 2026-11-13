import { NextFunction, Request, Response } from "express";
import { ensuredAuthenticated } from "./ensuredAuthenticated";

/**
 * Diretório: pacientes, médicos e administrador global podem consultar todos.
 * Uma conta hospitalar só pode consultar o próprio registo.
 */
export const ensureHospitalAccess = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    return ensuredAuthenticated(request, response, (error?: unknown) => {
        if (error) return next(error);

        if (request.userRole === "hospital") {
            request.hospitalId = request.userId;
            const requestedHospitalId = request.params.id;

            if (requestedHospitalId && requestedHospitalId !== request.userId) {
                return response.status(403).json({
                    message: "Não tem permissão para aceder aos dados deste hospital."
                });
            }
            return next();
        }

        if (["platform_admin", "patient", "doctor"].includes(request.userRole)) {
            request.isPlatformAdmin = request.userRole === "platform_admin";
            return next();
        }

        return response.status(403).json({
            message: "O perfil autenticado não tem permissão para consultar hospitais."
        });
    });
};

/** Apenas administrador global ou o próprio hospital; hospital não pode alterar outro ID. */
export const ensureHospitalManagementAccess = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    return ensuredAuthenticated(request, response, (error?: unknown) => {
        if (error) return next(error);

        if (request.userRole === "platform_admin") return next();

        if (request.userRole === "hospital" && request.params.id === request.userId) {
            request.hospitalId = request.userId;
            return next();
        }

        return response.status(403).json({
            message: "Apenas o administrador global ou o próprio hospital pode efectuar esta operação."
        });
    });
};
