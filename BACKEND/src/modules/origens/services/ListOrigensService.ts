import { OrigensRepository } from '../repositories/OrigensRepository';

export class ListOrigensService {
  private origensRepository: OrigensRepository;

  constructor() {
    this.origensRepository = new OrigensRepository();
  }

  async execute() {
    const origens = await this.origensRepository.findAll();
    return origens.map((o) => ({ id: o.id_origem, nome: o.nome_origem }));
  }
}
