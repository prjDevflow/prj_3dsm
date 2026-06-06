import { AppError } from '../../../shared/errors/AppError';
import { LojasRepository } from '../repositories/LojasRepository';

export class CreateLojaService {
  private lojasRepository: LojasRepository;

  constructor() {
    this.lojasRepository = new LojasRepository();
  }

  async execute(nomeRaw: string) {
    const nome = nomeRaw?.trim();

    if (!nome) {
      throw new AppError('Nome da loja é obrigatório.', 400);
    }

    if (await this.lojasRepository.findByName(nome)) {
      throw new AppError('Loja já cadastrada.', 400);
    }

    const loja = await this.lojasRepository.create(nome);
    return { id: loja.id_loja, nome: loja.nome_loja };
  }
}
