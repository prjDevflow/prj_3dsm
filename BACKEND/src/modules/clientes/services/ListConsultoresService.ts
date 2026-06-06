import { ClientesRepository } from '../repositories/ClientesRepository';

export class ListConsultoresService {
  private clientesRepository: ClientesRepository;

  constructor() {
    this.clientesRepository = new ClientesRepository();
  }

  async execute() {
    const usuarios = await this.clientesRepository.findConsultores();

    return usuarios.map((u) => ({
      id: u.id_usuario,
      name: u.nome_usuario,
      role: u.papel.nome_papel,
    }));
  }
}
