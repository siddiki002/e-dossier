export type userType = 'data-entry' | 'intructor' | 'oic' | 'ado' | null

export type AuthenticationResponse = {
    accessToken: string,
    role: userType,
    id? : string
}