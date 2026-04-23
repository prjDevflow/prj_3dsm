import { LogsRepository } from '../repositories/LogsRepository';

interface ICreateLogRequest {
  acao: string;
  entidade: string;
  entidadeId?: string | null;
  usuarioResponsavelId: string;
}

export class CreateLogService {
  private logsRepository: LogsRepository;

  constructor() {
    this.logsRepository = new LogsRepository();
  }

  async execute({ acao, entidade, entidadeId, usuarioResponsavelId }: ICreateLogRequest) {
    await this.logsRepository.create({
      id_usuario: usuarioResponsavelId,
      acao_log: acao,
      tabela_afetada_log: entidade,
      id_registro_afetado: entidadeId
    });
  }
}