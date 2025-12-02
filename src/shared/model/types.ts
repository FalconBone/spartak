export interface ApiError {
    status: number;
    data: { message: string };
}

export type Role = 'Owners' | 'Admins' | 'Managers' | 'Partners' | 'Developers' | null;

export type AppType = 'manager' | 'partner'