import type { Role } from "@shared/model/types";

type UserTeam = {
    abilities : string[],
    id: number,
    name: Role
}

export const getMeFromLocalStorage = () : UserTeam[] => {
    const authObject = localStorage.getItem('roles');
    if (!authObject) return [];

    return JSON.parse(authObject);
}