import { AuthService } from '../../services/implementations/AuthService';
import { useLoginModel } from './login.model';
import { LoginView } from './login.view';

const Login = () => {
  const authService = new AuthService();
  const methods = useLoginModel({
    authService,
  });
  return <LoginView {...methods} />;
};
  
export default Login;