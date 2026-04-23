import { UsersManagementRepository } from '../repositories/UsersManagementRepository';

export class ListUsersService {
  private usersRepository: UsersManagementRepository;

  constructor() {
    this.usersRepository = new UsersManagementRepository();
  }

  async execute() {
    return this.usersRepository.findAll();
  }
}