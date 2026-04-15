import { LoginService } from '../../services/implementations/LoginService';
import { useLoginModel } from './login.model';
import { LoginView } from './login.view';

const Login = () => {
  const loginUserService = new LoginService();
  const methods = useLoginModel({
    loginUserService,
  });
  return <LoginView {...methods} />;
};

export default Login;