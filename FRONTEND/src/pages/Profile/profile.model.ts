import { useAuth } from "./../../context/AuthContext";
import React, { useState } from "react";
import { IAuthService } from "../../services/IAuthService";

type ProfileModelProps = {
  authService: IAuthService;
};

export const useProfileModel = ({ authService }: ProfileModelProps) => {
  const { user, logout } = useAuth();

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEmailPass, setShowEmailPass] = useState(false);

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (pass: string) => {
    const errors = [];
    if (pass.length < 8) errors.push("Mínimo 8 caracteres");
    if (!/[A-Z]/.test(pass)) errors.push("Pelo menos uma letra maiúscula");
    if (!/[a-z]/.test(pass)) errors.push("Pelo menos uma letra minúscula");
    if (!/[0-9]/.test(pass)) errors.push("Pelo menos um número");
    if (!/[!@#$%^&*]/.test(pass))
      errors.push("Pelo menos um caractere especial (!@#$%^&*)");
    return errors;
  };

  const handlePasswordChange = (pass: string) => {
    setNewPassword(pass);
    setPasswordErrors(validatePassword(pass));
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // const isValid = await updateCredentials.validatePassword(emailPassword);
      // if (!isValid) {
      //   setError("Senha atual incorreta");
      //   setLoading(false);
      //   return;
      // }

      await authService.updateCredentials({ email: newEmail });

      setSuccess("Email atualizado com sucesso!");
      setIsEditingEmail(false);
      setNewEmail("");
      setEmailPassword("");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError("Erro ao atualizar email. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    if (passwordErrors.length > 0) {
      setError("A senha não atende aos requisitos mínimos");
      return;
    }

    setLoading(true);

    try {
      await authService.updateCredentials({ password: newPassword });

      setSuccess("Senha atualizada com sucesso!");
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors([]);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError("Erro ao atualizar senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEmailEdit = () => {
    setIsEditingEmail(false);
    setNewEmail("");
    setEmailPassword("");
    setError("");
  };

  const cancelPasswordEdit = () => {
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors([]);
    setError("");
  };

  return {
    user,
    logout,
    isEditingEmail,
    setIsEditingEmail,
    isEditingPassword,
    setIsEditingPassword,
    newEmail,
    setNewEmail,
    emailPassword,
    setEmailPassword,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    success,
    error,
    showCurrent,
    setShowCurrent,
    showNew,
    setShowNew,
    showConfirm,
    setShowConfirm,
    showEmailPass,
    setShowEmailPass,
    passwordErrors,
    handlePasswordChange,
    handleUpdateEmail,
    handleUpdatePassword,
    cancelEmailEdit,
    cancelPasswordEdit,
    validatePassword,
  };
};
