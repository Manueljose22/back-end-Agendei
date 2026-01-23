import { IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";





class DeleteDoctorsServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }

    async execute(hospitalId: string, id: string): Promise<void> {

        const doctor = await this.IDoctorsRepository.findById(id);

        if (doctor?.Hospital?.id !== hospitalId) {
            throw new Error('Não é possível concluír esta operação, por favor tente mais tarde.');
        }

        if (!doctor) {
            throw new Error('Não existe este douctor!');
        }

        await this.IDoctorsRepository.delete(hospitalId, id)
    }
}

export { DeleteDoctorsServices };