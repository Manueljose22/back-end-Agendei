import { Request, Response } from 'express';
import { PatientsRepository } from '../../repositories/patients/PatientsRepository';
import { ProfilePatientsServices } from '../../services/patients/ProfilePatientsServices';






class ProfilePatientsControllers {

    async handle(request: Request, response: Response) {

        const { userId } = request;
        
        try {

            const patientsRepository = new PatientsRepository();
            const service = new ProfilePatientsServices(patientsRepository);

            const result = await service.execute(userId)

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ProfilePatientsControllers;