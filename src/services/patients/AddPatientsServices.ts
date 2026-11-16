import { hash } from "bcrypt";
import { createUsersToken } from "../../middlewares/auth/create-users-token";
import {
    IPatientsRepository,
    patientsRequest,
    patientsSave
} from "../../repositories/patients/IPatientsRepository";

class AddPatientsServices {
    constructor(private patientsRepository: IPatientsRepository) {}

    async execute({
        name, email, password, address, dateBirth, gender, phone, photo, pushToken
    }: patientsRequest): Promise<{ user: patientsSave; token: string }> {
        if (!name?.trim()) {
            throw new Error("Preencha o campo nome.");
        }

        if (!password || password.length < 8) {
            throw new Error("A senha deve ter pelo menos 8 caracteres.");
        }

        if (email) {
            const patient = await this.patientsRepository.findByEmail(email);
            if (patient) {
                throw new Error("Já existe um paciente registado com este email.");
            }
        }

        const passwordHash = await hash(password, 12);
        const userCreated = await this.patientsRepository.save({
            name: name.trim(),
            email,
            password: passwordHash,
            address,
            dateBirth,
            gender,
            phone,
            photo,
            pushToken
        });

        const token = await createUsersToken({
            id: userCreated.id,
            email: userCreated.email,
            role: "patient"
        });

        return {
            user: { ...userCreated, password: null },
            token
        };
    }
}

export { AddPatientsServices };
