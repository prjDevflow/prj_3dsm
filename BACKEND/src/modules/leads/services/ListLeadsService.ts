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
    // 1. Valida as datas e aplica o limite temporal (RF06)
    const { startDate, endDate } = DateValidator.validate(inicio, fim, role);

    // 2. Aplica a lógica de permissões (RF02) passando as datas validadas para o banco
    if (role === 'ADMIN' || role === 'GERENTE_GERAL') {
      return this.leadsRepository.findAll(startDate, endDate);
    }

    if (role === 'GERENTE') {
      return this.leadsRepository.findByEquipeDoGerente(userId, startDate, endDate);
    }

    // Padrão: Atendente vê apenas os seus leads dentro do período
    return this.leadsRepository.findByAtendente(userId, startDate, endDate);
  }
}