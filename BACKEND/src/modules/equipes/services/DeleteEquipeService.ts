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
      const error = new Error("Equipe não encontrada.");
      (error as any).statusCode = 404;
      throw error;
    }

    try {
      await this.equipesRepository.delete(id);
    } catch (err) {
      const error = new Error("Não é possível excluir uma equipe que possui usuários vinculados.");
      (error as any).statusCode = 400;
      throw error;
    }

    // Auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.DELETE,
      entidade: 'EQUIPE',
      entidadeId: id,
      usuarioResponsavelId: usuarioLogadoId
    });
  }
}