import { hash } from "bcrypt";
import { createUsersToken } from "../../middlewares/auth/create-users-token";
import { IPatientsRepository, patientsRequest, patientsSave } from "../../repositories/patients/IPatientsRepository";





class AddPatientsServices {

    constructor(private IPatientsRepository: IPatientsRepository) { }

    async execute({ name, email, password, address, dateBirth, gender, phone, photo, pushToken }: patientsRequest): Promise<{ user: patientsSave, token: string } | Error> {

        if (email) {
            const patient = await this.IPatientsRepository.findByEmail(email);

            if (patient) {
                throw new Error('Já existe um registro com este nome!');
            }

            if (!name) {
                throw new Error('Preencha o campo nome.');
            } else if (!email) {
                throw new Error('Preencha o campo email.');
            } else if (!password) {
                throw new Error('Crie uma senha, por favor.');
            }

            const passHash = await hash(password, 12);

            const userCreated = await this.IPatientsRepository.save({ name, email, password: passHash, address, dateBirth, gender, phone, photo, pushToken });

            const token = await createUsersToken(userCreated)
            
            return {
                user: userCreated,
                token: token
            }
        } else {
        
            if (!name) {
                throw new Error('Preencha o campo nome.');
            } 

            password ='123456';

            const passHash = await hash(password, 12);

            const userCreated = await this.IPatientsRepository.save({ name, email, password: passHash, address, dateBirth, gender, phone, photo, pushToken });

            const token = await createUsersToken(userCreated)
            
            return {
                user: userCreated,
                token: token
            }
        }


    }
}

export { AddPatientsServices };