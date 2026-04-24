"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLogsController = void 0;
const ListLogsService_1 = require("../services/ListLogsService");
class ListLogsController {
    async handle(request, response) {
        const listLogsService = new ListLogsService_1.ListLogsService();
        const logs = await listLogsService.execute();
        return response.status(200).json(logs);
    }
}
exports.ListLogsController = ListLogsController;
