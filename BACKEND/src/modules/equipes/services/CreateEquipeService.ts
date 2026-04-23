import { EquipesRepository } from '../repositories/EquipesRepository';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';

interface ICreateEquipeRequest {
  nome: string;
  usuarioLogadoId: string;
}

export class CreateEquipeService {
  private equipesRepository: EquipesRepository;
  private createLogService: CreateLogService;

  constructor() {
    this.equipesRepository = new EquipesRepository();
    this.createLogService = new CreateLogService();
  }

  async execute({ nome, usuarioLogadoId }: ICreateEquipeRequest) {
    const equipeExists = await this.equipesRepository.findByName(nome);

    if (equipeExists) {
      const error = new Error("Já existe uma equipe com este nome.");
      (error as any).statusCode = 400;
      throw error;
    }

    const equipe = await this.equipesRepository.create(nome);

    // Auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.CREATE,
      entidade: 'EQUIPE',
      entidadeId: equipe.id_equipe,
      usuarioResponsavelId: usuarioLogadoId
    });

    return equipe;
  }
}