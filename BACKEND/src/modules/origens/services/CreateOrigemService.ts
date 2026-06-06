import { AppError } from '../../../shared/errors/AppError';
import { OrigensRepository } from '../repositories/OrigensRepository';

export class CreateOrigemService {
  private origensRepository: OrigensRepository;

  constructor() {
    this.origensRepository = new OrigensRepository();
  }

  async execute(nome: string) {
    if (await this.origensRepository.findByName(nome)) {
      throw new AppError('Origem já cadastrada.', 400);
    }

    return this.origensRepository.create(nome);
  }
}
