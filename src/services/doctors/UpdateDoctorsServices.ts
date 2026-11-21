import { AppError } from "../../errors/AppError";
import { hash } from "bcrypt";
import { normalizeDoctorStatus } from "../../utils/doctorStatus";
import { IDoctorsRepository, UpdateDoctor } from "../../repositories/doctors/IDoctorsRepository";

const parseOptionalNumber = (value: unknown, field: string, integer = true): number | null | undefined => {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;

    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0 || (integer && !Number.isInteger(parsed))) {
        throw new AppError(`O campo ${field} deve conter um número válido.`, 400);
    }

    return parsed;
};

class UpdateDoctorsServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(
        actorHospitalId: string,
        id: string,
        data: UpdateDoctor,
        isPlatformAdmin = false
    ): Promise<{ previousPhoto: string | null }> {
        const doctor = await this.doctorsRepository.findById(id, undefined, true);
        if (!doctor) throw new AppError("Médico não encontrado.", 404);

        const doctorHospitalId = doctor.hospitalId;
        if (!doctorHospitalId) throw new AppError("Este médico não está associado a um hospital.", 409);

        if (!isPlatformAdmin && doctorHospitalId !== actorHospitalId) {
            throw new AppError("Não tem permissão para alterar este médico.", 403);
        }

        if (data.specialtyId) {
            const belongs = await this.doctorsRepository.specialtyBelongsToHospital(data.specialtyId, doctorHospitalId);
            if (!belongs) throw new AppError("A especialidade seleccionada não pertence ao hospital do médico.", 400);
        }

        const safeData: UpdateDoctor = {
            name: data.name,
            photo: data.photo,
            email: data.email,
            phone: data.phone,
            bio: data.bio,
            address: data.address,
            yaersOfExperience: parseOptionalNumber(data.yaersOfExperience, "anos de experiência"),
            numberOfPatients: parseOptionalNumber(data.numberOfPatients, "número de pacientes"),
            rating: parseOptionalNumber(data.rating, "classificação", false),
            specialtyId: data.specialtyId,
            status: data.status === undefined ? undefined : normalizeDoctorStatus(data.status)
        };

        // A senha só é alterada quando o cliente envia um novo valor.
        // Valores vazios são ignorados para não apagar a credencial existente.
        if (data.password !== undefined && data.password !== null && data.password !== "") {
            if (data.password.length < 8) {
                throw new AppError("A senha do médico deve ter pelo menos 8 caracteres.", 400);
            }
            safeData.password = await hash(data.password, 12);
        }

        await this.doctorsRepository.update(id, safeData, isPlatformAdmin ? undefined : actorHospitalId);

        return { previousPhoto: doctor.photo };
    }
}

export { UpdateDoctorsServices };
