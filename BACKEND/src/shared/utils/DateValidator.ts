import { subDays, subYears, isAfter, parseISO, startOfDay, endOfDay } from 'date-fns';
import { UserRole } from '../../domain/models/UserRole';

export class DateValidator {
  // O segredo está na palavra "static" abaixo
  static validate(inicio?: string, fim?: string, role?: string) {
    const hoje = new Date();
    
    // RF06: Filtro padrão de 30 dias se não houver datas informadas
    let startDate = inicio ? startOfDay(parseISO(inicio)) : startOfDay(subDays(hoje, 30));
    let endDate = fim ? endOfDay(parseISO(fim)) : endOfDay(hoje);

    // RF06: Restrição de 1 ano para quem não é ADMIN
    if (role !== UserRole.ADMIN) {
      const umAnoAtras = subYears(hoje, 1);
      
      if (!isAfter(startDate, umAnoAtras)) {
        throw new Error("Limite de consulta excedido: Usuários não-administradores só podem consultar dados dos últimos 12 meses.");
      }
    }

    if (isAfter(startDate, endDate)) {
      throw new Error("A data de início não pode ser posterior à data de fim.");
    }

    return { startDate, endDate };
  }
}