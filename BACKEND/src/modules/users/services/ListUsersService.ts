import { UsersManagementRepository } from '../repositories/UsersManagementRepository';

export class ListUsersService {
  private usersRepository: UsersManagementRepository;

  constructor() {
    this.usersRepository = new UsersManagementRepository();
  }

  async execute(filters?: { search?: string; role?: string; equipeId?: string }) {
    return this.usersRepository.findAll(filters);
  }
}