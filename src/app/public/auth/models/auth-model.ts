export interface TokenContainer  {
    token: string;
}

export interface loginResponse extends TokenContainer {}

export interface Auth extends TokenContainer {}

export interface AuthData {
    email: string;
    password: string;
}