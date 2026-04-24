"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersService = void 0;
const UsersManagementRepository_1 = require("../repositories/UsersManagementRepository");
class ListUsersService {
    usersRepository;
    constructor() {
        this.usersRepository = new UsersManagementRepository_1.UsersManagementRepository();
    }
    async execute() {
        return this.usersRepository.findAll();
    }
}
exports.ListUsersService = ListUsersService;
