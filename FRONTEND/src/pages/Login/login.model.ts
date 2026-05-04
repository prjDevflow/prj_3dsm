import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { IAuthService } from "../../services/IAuthService";

type LoginModelProps = {
  authService: IAuthService;
};

export const useLoginModel = ({ authService }: LoginModelProps) => {
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

      const { user, token } = await authService.login({email, password}); // envia dados para servico

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
