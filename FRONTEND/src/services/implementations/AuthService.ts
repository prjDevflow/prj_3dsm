import InstanceApi from "../instanceApi";
import { IAuthService, IAuthCredentials, IAuthUpdateCredentials, IAuthLoginResponse } from "../IAuthService";
import { UserRole } from "../../types";

const roleMap: Record<string, UserRole> = {
  ADMIN:         'admin',
  GERENTE_GERAL: 'gerente_geral',
  GERENTE:       'gerente',
  ATENDENTE:     'atendente',
};

export class AuthService implements IAuthService {
  async login(credentials: IAuthCredentials): Promise<IAuthLoginResponse> {
    const { data } = await InstanceApi.post("sessions", {
      email: credentials.email,
      senha: credentials.password,
    });

    const u = data.user;
    return {
      user: {
        id:     u.id,
        nome:   u.name ?? u.nome,
        email:  u.email,
        role:   roleMap[u.role] ?? (u.role.toLowerCase() as UserRole),
        teamId: u.teamId ?? u.equipeId ?? undefined,
      },
      token: data.token,
    };
  }

  async updateCredentials(data: IAuthUpdateCredentials): Promise<void> {
    await InstanceApi.put("auth/me/credentials", {
      ...(data.email           !== undefined && { email: data.email }),
      ...(data.password        !== undefined && { senha: data.password }),
      ...(data.currentPassword !== undefined && { senhaAtual: data.currentPassword }),
    });
  }
}
