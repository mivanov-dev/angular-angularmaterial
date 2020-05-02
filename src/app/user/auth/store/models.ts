export interface RegisterStart {
    email: string;
    password: string;
    file?: string;
}

export interface Register {
    message: string;
}

export interface LoginStart {
    email: string;
    password: string;
    remember: boolean;
}

export interface Login {
    email: string;
    image: string;
    redirect: boolean;
    expires: number;
}

export interface Error {
    error: any;
}

export interface AuthMode {
    mode: string;
}
