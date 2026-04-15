import { UserRole } from "../types";

export interface ILoginService {
  exec(
    email: string,
    senha: string
  ): Promise<{
    user: {
      id: string;
      nome: string;
      email: string;
      role: UserRole;
    };
    token: string;
  }>;
}
export interface ICreateService {
  exec(nome: string, email: string, senha: string, role: string): Promise<{}>;
}
