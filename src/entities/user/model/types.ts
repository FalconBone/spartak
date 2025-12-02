import type { Role } from "@shared/model/types";

export interface LoginResponceData {
    user: User
    token: Token
    partner?: {
        id: number
        name: string
        find_cards: boolean
        is_active: boolean
        balance_remaining_shift: string
        payment_kind: string
    }
}

export interface User {
    id: number
    name: string
    email: string
    teams: Team[]
}

export interface Team {
    id: number
    name: string
    abilities: string[]
}

export interface Token {
    id: number
    token: string
}

  
export type UserObject = {
    login: string;
    role: Role;
    accessToken: string;
}

export type LoginFormData = {
    login: string;
    password: string;
};  

export interface AuthState {
    role: Role;
    isAuthenticated: boolean;
    accessToken: string | null;
    language: 'ru' | 'en'
}

export type UserObjectWithToken = UserObject & {
    accessToken: string
}

export type SaltAndChallenge = {
    salt: string;
    challenge: string
}

export type AuthentificationData = {
    hs: string, 
    client_challenge: string,
    login: string,
    fingerprint: string
}

export type RefreshTokenData = {
    refreshToken: string,
    fingerprint: string
}