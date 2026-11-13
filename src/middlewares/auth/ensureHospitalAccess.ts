import { NextFunction, Request, Response } from "express";
import { ensuredAuthenticated } from "./ensuredAuthenticated";
import { ensureRole } from "./ensureRole";

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

/** Apenas o administrador global ou a própria conta hospitalar pode gerir o registo. */
export const ensureHospitalManagementAccess = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    return ensureRole("platform_admin", "hospital")(request, response, next);
};
