import { LojasRepository } from '../repositories/LojasRepository';

export class ListLojasService {
  private lojasRepository: LojasRepository;

  constructor() {
    this.lojasRepository = new LojasRepository();
  }

  async execute() {
    const lojas = await this.lojasRepository.findAll();
    return lojas.map((l) => ({ id: l.id_loja, nome: l.nome_loja }));
  }
}
