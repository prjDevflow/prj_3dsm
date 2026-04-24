"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLeadsService = void 0;
const LeadsRepository_1 = require("../repositories/LeadsRepository");
const DateValidator_1 = require("../../../shared/utils/DateValidator");
class ListLeadsService {
    leadsRepository;
    constructor() {
        this.leadsRepository = new LeadsRepository_1.LeadsRepository();
    }
    async execute({ role, userId, inicio, fim }) {
        // 1. Valida as datas e aplica o limite temporal (RF06)
        const { startDate, endDate } = DateValidator_1.DateValidator.validate(inicio, fim, role);
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
exports.ListLeadsService = ListLeadsService;
