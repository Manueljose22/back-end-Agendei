import { DoctorStatus } from "@prisma/client";
import { AppError } from "../errors/AppError";

export function normalizeDoctorStatus(value: unknown, fallback?: DoctorStatus): DoctorStatus {
    if (value === undefined || value === null || value === "") {
        if (fallback) return fallback;
        throw new AppError("Informe um estado válido para o médico.", 400);
    }

    const normalized = String(value)
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

    if (["ACTIVE", "ACTIVO", "DISPONIVEL"].includes(normalized)) {
        return DoctorStatus.ACTIVE;
    }

    if (["INACTIVE", "INACTIVO", "INATIVO", "INDISPONIVEL"].includes(normalized)) {
        return DoctorStatus.INACTIVE;
    }

    throw new AppError("Estado inválido. Utilize ACTIVE ou INACTIVE.", 400);
}
