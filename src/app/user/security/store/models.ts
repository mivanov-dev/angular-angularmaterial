export interface SetupStart {
    enable: boolean;
}
export interface Setup {
    secretKey: string;
    url: string;
}
export interface VerifyStart {
    secretKey: string;
    code: string;
}
export interface Verify {
    message: string;
}
export interface Error {
    error: any;
}
