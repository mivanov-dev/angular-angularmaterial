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
export interface LoggedUser {
  email: string;
  image: string;
  redirect: boolean;
  expires: number;
  role: string;
  is2FAenabled: boolean;
}
export interface OtpLogin {
  message: string;
}
export interface Login {
  user?: LoggedUser;
  otp?: OtpLogin;
}
export interface Error {
  error: any;
}
export type AuthModeType = 'login' | 'register';
export interface AuthMode {
  mode: AuthModeType;
}
