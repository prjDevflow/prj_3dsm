import { useState } from "react";
import { ILoginService } from "../../services/IUsersService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

type LoginModelProps = {
  loginUserService: ILoginService;
};

export const useLoginModel = ({ loginUserService }: LoginModelProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setError("");
      setLoading(true);

      const { user, token } = await loginUserService.exec(email, password); // envia dados para servico

      login({ user, token }); // dados enviados para contexto

      navigate("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ?? "Ops! O email e/ou senha estão incorretos";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    error,
    email,
    setEmail,
    password,
    setPassword,
  };
};
