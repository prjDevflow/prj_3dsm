import { AppError } from '../../../shared/errors/AppError';
import { EquipesRepository } from '../repositories/EquipesRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface IDeleteEquipeRequest {
  id: string;
  usuarioLogadoId: string;
}

export class DeleteEquipeService {
  private equipesRepository: EquipesRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.equipesRepository = new EquipesRepository();
    this.createLogService = new CreateLogService();
  }

  async execute({ id, usuarioLogadoId }: IDeleteEquipeRequest) {
    const equipe = await this.equipesRepository.findById(id);

    if (!equipe) {
      throw new AppError("Equipe não encontrada.", 404);
    }

    try {
      await this.equipesRepository.delete(id);
    } catch (err) {
      throw new AppError("Não é possível excluir uma equipe que possui usuários vinculados.", 400);
    }

    // Auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.DELETE,
      entidade: 'EQUIPE',
      entidadeId: id,
      usuarioResponsavelId: usuarioLogadoId,
      detalhes: `Equipe '${equipe.nome_equipe}' excluída`,
    });
  }
}