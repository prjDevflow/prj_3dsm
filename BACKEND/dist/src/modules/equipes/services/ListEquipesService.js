"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListEquipesService = void 0;
const EquipesRepository_1 = require("../repositories/EquipesRepository");
class ListEquipesService {
    equipesRepository;
    constructor() {
        this.equipesRepository = new EquipesRepository_1.EquipesRepository();
    }
    async execute() {
        return this.equipesRepository.findAll();
    }
}
exports.ListEquipesService = ListEquipesService;
