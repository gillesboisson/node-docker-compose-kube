

export type UserCreate = {
    name: string;
    email: string;
    password?: string;
}

export type UserData = {
    id: number;
    name: string;
    email: string;
    password: string;
}
