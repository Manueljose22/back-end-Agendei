import { hash } from "bcrypt";
import { createUsersToken } from "../../middlewares/auth/create-users-token";
import { IPatientsRepository, patientsRequest, patientsSave } from "../../repositories/patients/IPatientsRepository";

class AddPatientsServices {
    constructor(private patientsRepository: IPatientsRepository) {}

    async execute({
        name, email, password, address, dateBirth, gender, phone, photo, pushToken
    }: patientsRequest): Promise<{ user: patientsSave; token: string } | Error> {
        if (email) {
            const patient = await this.patientsRepository.findByEmail(email);

            if (patient) {
                throw new Error("Já existe um registro com este email!");
            }
        }

        if (!name) {
            throw new Error("Preencha o campo nome.");
        }

        const patientPassword = password || "123456";
        const passHash = await hash(patientPassword, 12);

        const userCreated = await this.patientsRepository.save({
            name,
            email,
            password: passHash,
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
