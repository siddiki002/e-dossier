export type userType = 'data-entry' | 'intructor' | 'oic' | 'ado' | 'chief-exam' | null

export type AuthenticationResponse = {
    accessToken: string,
    role: userType,
    id? : string
}