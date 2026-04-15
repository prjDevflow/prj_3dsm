export interface ICreateService {
  exec(nome: string): Promise<{ id: string; nome: string }>;
}
