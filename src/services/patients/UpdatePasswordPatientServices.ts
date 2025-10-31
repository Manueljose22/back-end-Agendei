import { compare, hash } from "bcrypt";
import { IPatientsRepository } from "../../repositories/patients/IPatientsRepository";





class UpdatePasswordPatientServices {

    constructor(private IPatientRepository: IPatientsRepository) { }

    async execute(id: string, userId: string, data: { password: string, newPassword: string }): Promise<Error | void> {

        const patient = await this.IPatientRepository.findById(id);
        const isMatch = await compare(data.password, patient?.password!);
       
        
        if (!patient) {
            throw new Error("Usuário não existe");
        } else if(id !== userId){
            throw new Error("Erro no servidor, por favor tente mais tarde.");
        } else if (!isMatch) {
            throw new Error("Senha actual incorreta");
        }

        const passHash = await hash(data.newPassword, 12)

        await this.IPatientRepository.updatePassword(id, passHash)
    }
}

export { UpdatePasswordPatientServices };