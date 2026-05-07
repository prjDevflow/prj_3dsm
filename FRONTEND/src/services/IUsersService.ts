export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId?: string;
}

export interface IGetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  teamId?: string;
}

export interface IGetUsersResponse {
  data: IUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IUpdateUserRequest {
  name?: string;
  role?: string;
  teamId?: string;
}

export interface IUsersService {
  getUsers(params?: IGetUsersParams): Promise<IGetUsersResponse>;
  createUser(data: ICreateUserRequest): Promise<void>;
  updateUser(id: string, data: IUpdateUserRequest): Promise<void>;
  deleteUser(id: string): Promise<void>;
}


export interface IApiUser {
  id: string;
  nome: string;
  email: string;
  role: string;
  equipeId?: string;
}

export interface IApiGetUsersResponse {
  data: IApiUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}