"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLeadsController = void 0;
const ListLeadsService_1 = require("../services/ListLeadsService");
class ListLeadsController {
    async handle(req, res) {
        // Pegamos apenas o que o serviço realmente precisa: id (como userId), role e as datas da query
        const { id: userId, role } = req.user;
        const { inicio, fim } = req.query;
        const listLeadsService = new ListLeadsService_1.ListLeadsService();
        // Removemos o 'equipeId' daqui, pois o serviço não o utiliza na interface IListLeadsRequest
        const leads = await listLeadsService.execute({
            userId,
            role,
            inicio: inicio,
            fim: fim
        });
        return res.json(leads);
    }
}
exports.ListLeadsController = ListLeadsController;
