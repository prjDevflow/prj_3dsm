import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { userService } from '../services/userService';
import {
  User,
  Mail,
  Lock,
  Key,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  
  // Estados para edição
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  
  // Estados dos formulários
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Mostrar/esconder senhas
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEmailPass, setShowEmailPass] = useState(false);

  // Validações
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (pass: string) => {
    const errors = [];
    if (pass.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(pass)) errors.push('Pelo menos uma letra maiúscula');
    if (!/[a-z]/.test(pass)) errors.push('Pelo menos uma letra minúscula');
    if (!/[0-9]/.test(pass)) errors.push('Pelo menos um número');
    if (!/[!@#$%^&*]/.test(pass)) errors.push('Pelo menos um caractere especial (!@#$%^&*)');
    return errors;
  };

  const handlePasswordChange = (pass: string) => {
    setNewPassword(pass);
    setPasswordErrors(validatePassword(pass));
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validar senha (mock)
      const isValid = await userService.validatePassword(emailPassword);
      if (!isValid) {
        setError('Senha atual incorreta');
        setLoading(false);
        return;
      }

      await userService.updateEmail({
        newEmail,
        password: emailPassword
      });

      setSuccess('Email atualizado com sucesso!');
      setIsEditingEmail(false);
      setNewEmail('');
      setEmailPassword('');
      
      // Atualizar contexto (mock - em produção viria do backend)
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      setError('Erro ao atualizar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (newPassword !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    if (passwordErrors.length > 0) {
      setError('A senha não atende aos requisitos mínimos');
      return;
    }

    setLoading(true);

    try {
      await userService.updatePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });

      setSuccess('Senha atualizada com sucesso!');
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors([]);

      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (err) {
      setError('Erro ao atualizar senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const cancelEmailEdit = () => {
    setIsEditingEmail(false);
    setNewEmail('');
    setEmailPassword('');
    setError('');
  };

  const cancelPasswordEdit = () => {
    setIsEditingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header da página */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Meu Perfil</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie suas informações pessoais e segurança
          </p>
        </div>

        {/* Mensagens de feedback */}
        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center text-emerald-700">
            <CheckCircle size={20} className="mr-3 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center text-rose-700">
            <AlertCircle size={20} className="mr-3 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Card de Informações Básicas */}
        <div className="card overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center">
              <User size={20} className="text-[var(--color-primary)] mr-2" />
              <h2 className="text-sm font-semibold text-slate-800">Informações Básicas</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nome
                </label>
                <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg">
                  {user?.name}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Papel (Role)
                </label>
                <p className="text-sm">
                  <span className={`badge ${
                    user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    user?.role === 'gerente' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {user?.role}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Email */}
        <div className="card overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail size={20} className="text-[var(--color-primary)] mr-2" />
                <h2 className="text-sm font-semibold text-slate-800">E-mail</h2>
              </div>
              {!isEditingEmail && (
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary)] font-medium"
                >
                  Alterar e-mail
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {!isEditingEmail ? (
              <div>
                <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg">
                  {user?.email}
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Novo e-mail
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="input w-full"
                    placeholder="novo@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Confirme sua senha atual
                  </label>
                  <div className="relative">
                    <input
                      type={showEmailPass ? "text" : "password"}
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      className="input w-full pr-10"
                      placeholder="••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmailPass(!showEmailPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showEmailPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || !newEmail || !emailPassword}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Salvar</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEmailEdit}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Card de Senha */}
        <div className="card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock size={20} className="text-[var(--color-primary)] mr-2" />
                <h2 className="text-sm font-semibold text-slate-800">Senha</h2>
              </div>
              {!isEditingPassword && (
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary)] font-medium"
                >
                  Alterar senha
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {!isEditingPassword ? (
              <div>
                <p className="text-sm text-slate-600">••••••••</p>
                <p className="text-xs text-slate-400 mt-2">
                  Última alteração: há 30 dias
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Senha atual
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input w-full pr-10"
                      placeholder="••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="input w-full pr-10"
                      placeholder="••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Requisitos de senha */}
                  {newPassword && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs font-medium text-slate-700 mb-2">
                        Requisitos:
                      </p>
                      <ul className="space-y-1">
                        <li className={`text-xs flex items-center ${newPassword.length >= 8 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span className="mr-2">{newPassword.length >= 8 ? '✓' : '○'}</span>
                          Mínimo 8 caracteres
                        </li>
                        <li className={`text-xs flex items-center ${/[A-Z]/.test(newPassword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span className="mr-2">{/[A-Z]/.test(newPassword) ? '✓' : '○'}</span>
                          Uma letra maiúscula
                        </li>
                        <li className={`text-xs flex items-center ${/[a-z]/.test(newPassword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span className="mr-2">{/[a-z]/.test(newPassword) ? '✓' : '○'}</span>
                          Uma letra minúscula
                        </li>
                        <li className={`text-xs flex items-center ${/[0-9]/.test(newPassword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span className="mr-2">{/[0-9]/.test(newPassword) ? '✓' : '○'}</span>
                          Um número
                        </li>
                        <li className={`text-xs flex items-center ${/[!@#$%^&*]/.test(newPassword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span className="mr-2">{/[!@#$%^&*]/.test(newPassword) ? '✓' : '○'}</span>
                          Um caractere especial (!@#$%^&*)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input w-full pr-10"
                      placeholder="••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-rose-600 mt-1">
                      As senhas não conferem
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || passwordErrors.length > 0}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Key size={16} />
                        <span>Alterar senha</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelPasswordEdit}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Dica de segurança */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700">
            🔒 Mantenha sua senha segura e não a compartilhe com ninguém.
            Recomendamos alterar a senha a cada 90 dias.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Profile;