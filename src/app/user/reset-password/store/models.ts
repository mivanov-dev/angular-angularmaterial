export interface ResetPasswordStart {
    password: string;
    repeatedPassword: string;
    token: string;
}
export interface IError {
    error: any;
}