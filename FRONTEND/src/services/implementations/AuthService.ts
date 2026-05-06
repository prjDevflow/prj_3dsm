import InstanceApi from "../instanceApi";
import { IAuthService, IAuthCredentials, IAuthUpdateCredentials, IAuthLoginResponse } from "../IAuthService";

export class AuthService implements IAuthService {
  async login(credentials: IAuthCredentials): Promise<IAuthLoginResponse> {
    const { data } = await InstanceApi.post("sessions", credentials);

    return {
      user: data.user,
      token: data.token,
    };
  }

  async updateCredentials(data: IAuthUpdateCredentials): Promise<void> {
    await InstanceApi.put("auth/me/credentials", data);
  }
}
