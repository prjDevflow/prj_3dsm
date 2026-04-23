import { EquipesRepository } from '../repositories/EquipesRepository';

export class ListEquipesService {
  private equipesRepository: EquipesRepository;

  constructor() {
    this.equipesRepository = new EquipesRepository();
  }

  async execute() {
    return this.equipesRepository.findAll();
  }
}