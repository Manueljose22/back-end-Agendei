import { patientsSave } from "../../repositories/patients/IPatientsRepository";

export type PatientPublic = Omit<patientsSave, "password" | "pushToken">;

export const toPatientPublic = (patient: patientsSave): PatientPublic => {
    const { password: _password, pushToken: _pushToken, ...publicData } = patient;
    return publicData;
};
