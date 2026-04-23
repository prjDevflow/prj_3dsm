export interface ICreateService {
  exec(
    nome: string,
    email: string,
    telefone: string
  ): Promise<{ id: string; nome: string; telefone: string; email: string }>;
}
