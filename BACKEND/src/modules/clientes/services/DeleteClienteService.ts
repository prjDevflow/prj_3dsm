import { AppError } from '../../../shared/errors/AppError';
import { ClientesRepository } from '../repositories/ClientesRepository';

export class DeleteClienteService {
  private clientesRepository: ClientesRepository;

  constructor() {
    this.clientesRepository = new ClientesRepository();
  }

  async execute(id: string): Promise<void> {
    const cliente = await this.clientesRepository.findById(id);
    if (!cliente) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    await this.clientesRepository.deleteCascade(id);
  }
}
