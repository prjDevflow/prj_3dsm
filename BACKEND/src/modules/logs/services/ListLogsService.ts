import { LogsRepository } from "../repositories/LogsRepository";
import { Log } from "../../../domain/models/Log";
import { UserRole } from "../../../domain/models/UserRole";

interface IListLogsRequest {
  role: string;
}

export class ListLogsService {
  private logsRepository: LogsRepository;

  constructor() {
    this.logsRepository = new LogsRepository();
  }

  async execute({ role }: IListLogsRequest): Promise<Log[]> {
    // RF07 e RF02: Bloqueio estrito de acesso.
    // Atendentes, Gerentes e Gerentes Gerais NÃO PODEM aceder aos logs.
    if (role !== UserRole.ADMIN) {
      throw new Error("Acesso negado: Apenas administradores têm permissão para aceder aos logs completos do sistema.");
    }

    return this.logsRepository.findAll();
  }
}