import { hash } from "bcrypt";
import { IPatientsRepository, patientsRequest } from "../../repositories/patients/IPatientsRepository";






class UpdatePatientsServices {

    constructor(private IPatientsRepository: IPatientsRepository) { }



    async execute(id: string, { name, email, password, address, dateBirth, gender,  phone, photo, pushToken }: patientsRequest): Promise<void | Error> {

        const patient = await this.IPatientsRepository.findById(id);

        if (!patient) {
            throw new Error('usuário inválido!');
        }


        if (password) {
            password = await hash(password, 12)
        }



        const data = {
            name: name ?? patient.name,
            email: email ?? patient.email,
            password: password ?? patient.password,
            phone: phone ?? patient.phone ,
            dateBirth: dateBirth ?? patient.dateBirth,
            address: address ?? patient.address,
            gender: gender ?? patient.gender,
            photo: photo ?? patient.photo,
            pushToken: pushToken ?? patient.pushToken
        }


        await this.IPatientsRepository.update(id, data)
    }
}

export { UpdatePatientsServices };