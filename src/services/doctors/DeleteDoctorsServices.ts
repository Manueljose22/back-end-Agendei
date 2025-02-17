import { IDoctorsRepository } from "../../repositorys/doctors/IDoctorsRepository";





class DeleteDoctorsServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }

    async execute(id: string): Promise<void> {

        const doctor = await this.IDoctorsRepository.findById(id);

        if (!doctor) {
            throw new Error('Não existe este douctor!');
        }

        await this.IDoctorsRepository.delete(id)
    }
}

export { DeleteDoctorsServices };