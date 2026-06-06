import { LojasRepository } from '../repositories/LojasRepository';

export class DeleteLojaService {
  private lojasRepository: LojasRepository;

  constructor() {
    this.lojasRepository = new LojasRepository();
  }

  async execute(id: string): Promise<void> {
    await this.lojasRepository.delete(id);
  }
}
