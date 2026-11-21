import { AppError } from "../../errors/AppError";
import { normalizeDoctorStatus } from "../../utils/doctorStatus";
import { IDoctorsRepository, UpdateDoctor } from "../../repositories/doctors/IDoctorsRepository";

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
            yaersOfExperience: data.yaersOfExperience,
            numberOfPatients: data.numberOfPatients,
            rating: data.rating,
            specialtyId: data.specialtyId,
            status: data.status === undefined ? undefined : normalizeDoctorStatus(data.status)
        };

        await this.doctorsRepository.update(id, safeData, isPlatformAdmin ? undefined : actorHospitalId);

        return { previousPhoto: doctor.photo };
    }
}

export { UpdateDoctorsServices };
