import { IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";

class ServiceToDoctorServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(
        actorHospitalId: string,
        { serviceId, doctorId, price, durationMinutes = 45 }: { serviceId: string; doctorId: string; price: number; durationMinutes?: number },
        isPlatformAdmin = false
    ): Promise<void> {
        if (!serviceId || !doctorId || !Number.isFinite(price) || price < 0 ||\n            !Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 240) {
            throw new Error("Informe serviço, médico, preço válido e duração entre 5 e 240 minutos.");
        }

        const doctor = await this.doctorsRepository.findById(doctorId, undefined, true);
        if (!doctor?.hospitalId) throw new Error("Médico não encontrado ou sem hospital associado.");

        if (!isPlatformAdmin && doctor.hospitalId !== actorHospitalId) {
            throw new Error("O médico não pertence ao seu hospital.");
        }

        const serviceBelongs = await this.doctorsRepository.serviceBelongsToHospital(serviceId, doctor.hospitalId);
        if (!serviceBelongs) throw new Error("O serviço seleccionado não pertence ao hospital do médico.");

        await this.doctorsRepository.serviceToDoctor({ serviceId, doctorId, price, durationMinutes });
    }
}

export { ServiceToDoctorServices };
