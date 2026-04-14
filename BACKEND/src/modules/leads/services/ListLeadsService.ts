import { LeadsRepository } from '../repositories/LeadsRepository';
import { DateValidator } from '../../../shared/utils/DateValidator';

interface IListLeadsRequest {
  role: string;
  userId: string;
  inicio?: string; // String que vem da query
  fim?: string;    // String que vem da query
}

export class ListLeadsService {
  private leadsRepository: LeadsRepository;

  constructor() {
    this.leadsRepository = new LeadsRepository();
  }

  async execute({ role, userId, inicio, fim }: IListLeadsRequest) {
    // 1. Valida as datas usando o método correto 'validate'
    const { startDate, endDate } = DateValidator.validate(inicio, fim, role);

    // 2. Aplica a lógica de permissões (RF02)
    if (role === 'ADMIN') {
      return this.leadsRepository.findAll();
    }

    if (role === 'GERENTE') {
      return this.leadsRepository.findByEquipeDoGerente(userId);
    }

    // Padrão: Atendente vê apenas os seus
    return this.leadsRepository.findByAtendente(userId);
  }
}