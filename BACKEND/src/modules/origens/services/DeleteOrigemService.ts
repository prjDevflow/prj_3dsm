import { OrigensRepository } from '../repositories/OrigensRepository';

export class DeleteOrigemService {
  private origensRepository: OrigensRepository;

  constructor() {
    this.origensRepository = new OrigensRepository();
  }

  async execute(id: string): Promise<void> {
    await this.origensRepository.delete(id);
  }
}
