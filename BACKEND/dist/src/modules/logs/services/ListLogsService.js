"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLogsService = void 0;
const LogsRepository_1 = require("../repositories/LogsRepository");
class ListLogsService {
    logsRepository;
    constructor() {
        this.logsRepository = new LogsRepository_1.LogsRepository();
    }
    async execute() {
        return this.logsRepository.findAll();
    }
}
exports.ListLogsService = ListLogsService;
