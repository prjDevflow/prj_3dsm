import { Lead } from "../../../domain/models/Lead";
import { DateValidator } from "../../../shared/utils/DateValidator";

// Interface para os filtros de consulta
interface IRequest {
  userId: string;
  role: string;
  equipeId?: string;
  startDate?: Date;
}

export class ListLeadsService {
  // O repositório real será injetado aqui futuramente
  private leadsRepository: any; 

  async execute({ userId, role, equipeId, startDate }: IRequest): Promise<Lead[]> {
    
    // 1. Validação de Segurança de Datas (RNF)
    // Lança erro se não-admin tentar consultar mais de 12 meses
    if (startDate) {
      DateValidator.validateRange(startDate, role);
    }

    // 2. Lógica de Filtro por Hierarquia (RF02)
    
    // ADMIN e GERENTE_GERAL: Acesso total a todos os leads
    if (role === 'ADMIN' || role === 'GERENTE_GERAL') {
      return this.leadsRepository.findAll(); 
    }

    // GERENTE: Vê apenas os leads da sua própria equipa
    if (role === 'GERENTE') {
      if (!equipeId) {
        throw new Error("Gerente sem equipa vinculada.");
      }
      return this.leadsRepository.findByEquipe(equipeId);
    }

    // ATENDENTE: Vê apenas os seus próprios leads
    if (role === 'ATENDENTE') {
      return this.leadsRepository.findByAtendente(userId);
    }

    return [];
  }
}