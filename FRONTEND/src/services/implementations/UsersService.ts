import InstanceApi from '../instanceApi';
import {
  IUsersService,
  IGetUsersParams,
  IGetUsersResponse,
  ICreateUserRequest,
  IUpdateUserRequest,
  IUser,
  IApiUser,
  IApiGetUsersResponse,
} from '../IUsersService';

export class UsersService implements IUsersService {
  private api = InstanceApi;

  private mapApiUserToUser(user: IApiUser): IUser {
    return {
      id:     user.id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      teamId: user.teamId,
      active: user.active ?? true,
    };
  }

  async getUsers(params?: IGetUsersParams): Promise<IGetUsersResponse> {
    const queryParams: Record<string, unknown> = {
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      role: params?.role,
    };

    if (params?.teamId) {
      queryParams.teamId = params.teamId;
      queryParams.equipeId = params.teamId;
    }

    const response = await this.api.get<IApiGetUsersResponse>('/users', {
      params: queryParams,
    });

    return {
      ...response.data,
      data: response.data.data.map(this.mapApiUserToUser),
    };
  }

  async createUser(data: ICreateUserRequest): Promise<void> {
    await this.api.post('/users', {
      nome: data.name,
      email: data.email,
      senha: data.password,
      role: data.role,
      equipeId: data.teamId || undefined,
    });
  }

  async updateUser(id: string, data: IUpdateUserRequest): Promise<void> {
    await this.api.put(`/users/${id}`, {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.role !== undefined ? { role: data.role } : {}),
      ...(data.teamId !== undefined ? { teamId: data.teamId } : {}),
      ...(data.active !== undefined ? { active: data.active } : {}),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }
}
