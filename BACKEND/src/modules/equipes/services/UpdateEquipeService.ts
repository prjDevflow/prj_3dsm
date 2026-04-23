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
      const error = new Error("Equipe não encontrada.");
      (error as any).statusCode = 404;
      throw error;
    }

    const equipeAtualizada = await this.equipesRepository.update(id, nome);

    // Auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.UPDATE,
      entidade: 'EQUIPE',
      entidadeId: equipeAtualizada.id_equipe,
      usuarioResponsavelId: usuarioLogadoId
    });

    return equipeAtualizada;
  }
}