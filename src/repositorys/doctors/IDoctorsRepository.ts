

export type doctorRequest = {
  name: string;
  especialty: string;
  photo: string;
}

export type doctorSave = {
    id: string;
    name: string;
    especialty: string;
    photo: string;
    createdAt: Date;
    updatedAt: Date;
}

export type doctorServices = {
  idService: string;
  description: string;
  price: number;
}



export interface IDoctorsRepository {
    save(data: doctorRequest): Promise<void>
    findByName(name: string): Promise<doctorSave | null>
    findById(id: string): Promise<doctorSave | null>
    findDoctorService(id: string): Promise<doctorServices[] | null>
    findAll(search: string): Promise<doctorSave[] | null>
    findSearch(search: string): Promise<doctorSave[] | null>
    update(id: string, data: doctorRequest): Promise<void | null>
    delete(id: string): Promise<void>
}