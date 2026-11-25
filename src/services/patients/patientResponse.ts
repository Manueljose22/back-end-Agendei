import { patientsSave } from "../../repositories/patients/IPatientsRepository";

export type PatientPublic = Omit<patientsSave, "password" | "pushToken" | "tokenVersion">;

export const toPatientPublic = (patient: patientsSave): PatientPublic => {
    const {
        password: _password,
        pushToken: _pushToken,
        tokenVersion: _tokenVersion,
        ...publicData
    } = patient;
    return publicData;
};
