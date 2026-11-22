import { HospitalStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../../config/prisma/prismaClient";
import { AppError } from "../../errors/AppError";

/**
 * Bloqueia operações de gestão quando a conta hospitalar ou o hospital
 * associado ao médico está suspenso ou não existe. O estado é lido da BD.
 */
export const ensureActiveHospital = async (
    request: Request,
    _response: Response,
    next: NextFunction
) => {
    try {
        if (request.userRole === "platform_admin") return next();

        let hospitalStatus: HospitalStatus | null = null;

        if (request.userRole === "hospital") {
            const hospital = await prismaClient.hospital.findUnique({
                where: { id: request.userId },
                select: { status: true }
            });

            if (!hospital) {
                return next(new AppError("Conta hospitalar não encontrada.", 403));
            }

            hospitalStatus = hospital.status;
        } else if (request.userRole === "doctor") {
            const doctor = await prismaClient.doctor.findUnique({
                where: { id: request.userId },
                select: { Hospital: { select: { status: true } } }
            });

            if (!doctor?.Hospital) {
                return next(new AppError("Médico ou hospital associado não encontrado.", 403));
            }

            hospitalStatus = doctor.Hospital.status;
        } else {
            return next();
        }

        if (hospitalStatus !== HospitalStatus.ACTIVE) {
            return next(new AppError("Este hospital não está activo. As operações de gestão estão bloqueadas.", 403));
        }

        return next();
    } catch (error) {
        return next(error);
    }
};
