import { User } from "../types";

export interface IAuthCredentials {
  email: string;
  password: string;
}

export interface IAuthUpdateCredentials {
  email?: string;
  password?: string;
}

export interface IAuthLoginResponse {
  user: User;
  token: string;
}

export interface IAuthService {
  login(credentials: IAuthCredentials): Promise<IAuthLoginResponse>;
  updateCredentials(data: IAuthUpdateCredentials): Promise<void>;
}