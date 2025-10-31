

export type doctorRequest = {
  name: string;
  photo: string | null;
  email: string
  password: string | null
  phone: string | null
  bio: string | null
  address: string | null
  yaersOfExperience: number | null
  numberOfPatients: number | null
  rating: number | null
  specialtyId: string
  hospitalId: string | null
}

export type doctorSave = {
  id: string;
  name: string;
  photo: string | null;
  email: string
  password: string | null
  phone: string | null
  bio: string | null
  address: string | null
  yaersOfExperience: number | null
  numberOfPatients: number | null
  rating: number | null
  Specialty: {
    id: string;
    name: string;
  } | null; 
  Hospital:{
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    images: {
      id: string;
      urlImagem: string;
    }[];
    createdAt: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export type doctorServices = {
  idService: string;
  title: string;
  price: number;
}

export interface UpdateDoctor extends Partial<doctorRequest> {}  


export interface IDoctorsRepository {
  save(data: doctorRequest): Promise<void>
  serviceToDoctor({serviceId, doctorId, price}: {serviceId: string, doctorId: string, price: number}): Promise<void>
  findByName(name: string): Promise<doctorSave | null>
  findById(id: string): Promise<doctorSave | null>
  findDoctorService(id: string): Promise<doctorServices[] | null>
  findAll(): Promise<doctorSave[] | null>
  findSearch(search: string): Promise<doctorSave[] | null>
  update(id: string, data: UpdateDoctor): Promise<void | null>
  delete(id: string): Promise<void>
}