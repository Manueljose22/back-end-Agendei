export type doctorRequest = {
  name: string;
  photo: string | null;
  email: string;
  password: string | null;
  phone: string | null;
  bio: string | null;
  address: string | null;
  yaersOfExperience: number | null;
  numberOfPatients: number | null;
  rating: number | null;
  specialtyId: string;
  status: string | null;
  hospitalId: string | null;
};

export type doctorSave = {
  id: string;
  name: string;
  photo: string | null;
  email: string;
  status: string | null;
  phone: string | null;
  bio: string | null;
  address: string | null;
  yaersOfExperience: number | null;
  numberOfPatients: number | null;
  rating: number | null;
  specialtyId: string;
  hospitalId: string | null;
  Specialty: { id: string; name: string } | null;
  Hospital: {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    images: { id: string; urlImagem: string }[];
    createdAt: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

export type doctorServices = {
  idService: string;
  title: string;
  price: number;
};

export type UpdateDoctor = Partial<Omit<doctorRequest, "hospitalId" | "password">>;

export interface IDoctorsRepository {
  save(data: doctorRequest): Promise<void>;
  serviceToDoctor(data: { serviceId: string; doctorId: string; price: number }): Promise<void>;
  findByName(name: string, hospitalId?: string): Promise<doctorSave | null>;
  findById(id: string, hospitalId?: string, includeSuspended?: boolean): Promise<doctorSave | null>;
  findDoctorService(id: string): Promise<doctorServices[] | null>;
  findAll(hospitalId?: string, includeSuspended?: boolean): Promise<doctorSave[]>;
  findAllByHospital(idHospital: string, includeSuspended?: boolean): Promise<doctorSave[]>;
  findSearch(search: string, hospitalId?: string, includeSuspended?: boolean): Promise<doctorSave[]>;
  specialtyBelongsToHospital(specialtyId: string, hospitalId: string): Promise<boolean>;
  serviceBelongsToHospital(serviceId: string, hospitalId: string): Promise<boolean>;
  update(id: string, data: UpdateDoctor, hospitalId?: string): Promise<void>;
  delete(hospitalId: string, id: string): Promise<void>;
}
