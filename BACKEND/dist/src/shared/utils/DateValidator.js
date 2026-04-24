"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateValidator = void 0;
const date_fns_1 = require("date-fns");
const UserRole_1 = require("../../domain/models/UserRole");
class DateValidator {
    // O segredo está na palavra "static" abaixo
    static validate(inicio, fim, role) {
        const hoje = new Date();
        // RF06: Filtro padrão de 30 dias se não houver datas informadas
        let startDate = inicio ? (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(inicio)) : (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(hoje, 30));
        let endDate = fim ? (0, date_fns_1.endOfDay)((0, date_fns_1.parseISO)(fim)) : (0, date_fns_1.endOfDay)(hoje);
        // RF06: Restrição de 1 ano para quem não é ADMIN
        if (role !== UserRole_1.UserRole.ADMIN) {
            const umAnoAtras = (0, date_fns_1.subYears)(hoje, 1);
            if (!(0, date_fns_1.isAfter)(startDate, umAnoAtras)) {
                throw new Error("Limite de consulta excedido: Usuários não-administradores só podem consultar dados dos últimos 12 meses.");
            }
        }
        if ((0, date_fns_1.isAfter)(startDate, endDate)) {
            throw new Error("A data de início não pode ser posterior à data de fim.");
        }
        return { startDate, endDate };
    }
}
exports.DateValidator = DateValidator;
