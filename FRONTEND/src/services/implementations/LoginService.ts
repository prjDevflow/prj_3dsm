import { UserRole } from "../../types";
import InstanceApi from "../instanceApi";
import { ILoginService } from "../IUsersService";

export class LoginService implements ILoginService {
  async exec(
    email: string,
    senha: string
  ): Promise<{
    user: { id: string; nome: string; email: string; role: UserRole };
    token: string;
  }> {
    const { data } = await InstanceApi.post("sessions", { email, senha });

    return {
      user: data.user,
      token: data.token,
    };
  }
}
