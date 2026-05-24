import { LeadsRepository } from '../repositories/LeadsRepository';
import { DateValidator } from '../../../shared/utils/DateValidator';

interface IListLeadsRequest {
  role: string;
  userId: string;
  inicio?: string;
  fim?: string;
  store?: string;
  team?: string;
}

export class ListLeadsService {
  private leadsRepository: LeadsRepository;

  constructor() {
    this.leadsRepository = new LeadsRepository();
  }

  async execute({ role, userId, inicio, fim, store, team }: IListLeadsRequest) {
    const { startDate, endDate } = DateValidator.validate(inicio, fim, role);

    const lojaName  = store && store !== 'all' ? store : undefined;
    const equipeName = team  && team  !== 'all' ? team  : undefined;

    if (role === 'ADMIN' || role === 'GERENTE_GERAL') {
      return this.leadsRepository.findAll(startDate, endDate, lojaName, equipeName);
    }

    if (role === 'GERENTE') {
      return this.leadsRepository.findByEquipeDoGerente(userId, startDate, endDate, lojaName);
    }

    return this.leadsRepository.findByAtendente(userId, startDate, endDate, lojaName);
  }
}