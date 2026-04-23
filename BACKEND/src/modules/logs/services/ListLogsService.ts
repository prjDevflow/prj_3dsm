import { LogsRepository } from '../repositories/LogsRepository';

export class ListLogsService {
  private logsRepository: LogsRepository;

  constructor() {
    this.logsRepository = new LogsRepository();
  }

  async execute() {
    return this.logsRepository.findAll();
  }
}