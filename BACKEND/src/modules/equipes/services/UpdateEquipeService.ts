import { AppError } from '../../../shared/errors/AppError';
import { EquipesRepository } from '../repositories/EquipesRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface IUpdateEquipeRequest {
  id: string;
  nome: string;
  usuarioLogadoId: string;
}

export class UpdateEquipeService {
  private equipesRepository: EquipesRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.equipesRepository = new EquipesRepository();
    this.createLogService = new CreateLogService();
  }

  async execute({ id, nome, usuarioLogadoId }: IUpdateEquipeRequest) {
    const equipe = await this.equipesRepository.findById(id);

    if (!equipe) {
      throw new AppError("Equipe não encontrada.", 404);
    }

    const equipeAtualizada = await this.equipesRepository.update(id, nome);

    // Auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.UPDATE,
      entidade: 'EQUIPE',
      entidadeId: equipeAtualizada.id_equipe,
      usuarioResponsavelId: usuarioLogadoId,
      detalhes: `Equipe renomeada de '${equipe.nome_equipe}' para '${nome}'`,
    });

    return equipeAtualizada;
  }
}