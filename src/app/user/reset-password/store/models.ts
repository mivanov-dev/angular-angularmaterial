export interface ResetPasswordStart {
  password: string;
  repeatedPassword: string;
  token: string;
}
export interface Error {
  error: any;
}
