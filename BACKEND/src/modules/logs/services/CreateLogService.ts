import { LogsRepository } from "../repositories/LogsRepository";
import { LogAction } from "../../../domain/models/Log";

interface ICreateLogRequest {
  acao: LogAction;
  entidade: string;
  entidadeId?: string;
  usuarioResponsavelId: string;
}

export class CreateLogService {
  private logsRepository: LogsRepository;

  constructor() {
    this.logsRepository = new LogsRepository();
  }

  async execute({ acao, entidade, entidadeId, usuarioResponsavelId }: ICreateLogRequest): Promise<void> {
    await this.logsRepository.create({
      acao,
      entidade,
      entidadeId,
      usuarioResponsavelId
    });
  }
}