export type AuthRole = "patient" | "doctor" | "hospital" | "admin";

export type AuthProfileRecord = {
    authUserId: string;
    role: AuthRole;
    profileId: string;
};

export interface IAuthRepository {
    createPatientProfile(data: { authUserId: string; name: string; email: string; phone?: string | null }): Promise<AuthProfileRecord>;
    findProfileByAuthUserId(authUserId: string): Promise<AuthProfileRecord | null>;
}
