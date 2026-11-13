import { HospitalStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../../config/prisma/prismaClient";

/**
 * Bloqueia operações de gestão quando a conta hospitalar ou o hospital
 * associado ao médico está suspenso. O estado é sempre lido da BD.
 */
export const ensureActiveHospital = async (
    request: Request,
    response: Response,
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
            hospitalStatus = hospital?.status ?? null;
        } else if (request.userRole === "doctor") {
            const doctor = await prismaClient.doctor.findUnique({
                where: { id: request.userId },
                select: { Hospital: { select: { status: true } } }
            });
            hospitalStatus = doctor?.Hospital?.status ?? null;
        }

        if (hospitalStatus === HospitalStatus.SUSPENDED) {
            return response.status(403).json({
                message: "Este hospital está suspenso. As operações de gestão estão bloqueadas."
            });
        }

        return next();
    } catch (error) {
        return next(error);
    }
};
