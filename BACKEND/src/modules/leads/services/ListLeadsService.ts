import { LeadsRepository } from '../repositories/LeadsRepository';
import { DateValidator } from '../../../shared/utils/DateValidator';

interface IListLeadsRequest {
  role: string;
  userId: string;
  inicio?: string;
  fim?: string;
  store?: string;
  team?: string;
  search?: string;
}

export class ListLeadsService {
  private leadsRepository: LeadsRepository;

  constructor() {
    this.leadsRepository = new LeadsRepository();
  }

  async execute({ role, userId, inicio, fim, store, team, search }: IListLeadsRequest) {
    const { startDate, endDate } = DateValidator.validate(inicio, fim, role);

    const lojaName  = store && store !== 'all' ? store : undefined;
    const equipeName = team  && team  !== 'all' ? team  : undefined;

    let leads: any[];

    if (role === 'ADMIN' || role === 'GERENTE_GERAL') {
      leads = await this.leadsRepository.findAll(startDate, endDate, lojaName, equipeName);
    } else if (role === 'GERENTE') {
      leads = await this.leadsRepository.findByEquipeDoGerente(userId, startDate, endDate, lojaName);
    } else {
      leads = await this.leadsRepository.findByAtendente(userId, startDate, endDate, lojaName);
    }

    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter((l) => {
        const clientName  = (l.cliente?.nome_cliente ?? '').toLowerCase();
        const agentName   = (l.usuario?.nome_usuario ?? '').toLowerCase();
        const clientEmail = (l.cliente?.email_cliente ?? '').toLowerCase();
        return clientName.includes(q) || agentName.includes(q) || clientEmail.includes(q);
      });
    }

    return leads;
  }
}