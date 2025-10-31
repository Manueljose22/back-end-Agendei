

export type patientsRequest = {
  name: string;
  email: string;
  password: string;
  phone: string | null;
  photo: string | null;
  dateBirth: Date | null;
  address: string | null;
  gender: string | null;
  pushToken: string | null;
}


export type patientsSave = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  photo: string | null;
  dateBirth: Date | null;
  address: string | null;
  gender: string | null;
  pushToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}



export interface IPatientsRepository {
  save(data: patientsRequest): Promise<patientsSave>
  findByName(name: string): Promise<patientsSave | null>
  findByEmail(email: string): Promise<patientsSave | null>
  findById(id: string): Promise<patientsSave | null>
  findAll(search: string): Promise<patientsSave[] | null>
  findSearch(search: string): Promise<patientsSave[] | null>
  update(id: string, data: patientsRequest): Promise<patientsSave | null>
  delete(id: string): Promise<void>
  updatePassword(id: string, password: string): Promise<void>;
}