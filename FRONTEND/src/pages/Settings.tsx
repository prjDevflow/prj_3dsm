import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { 
  Save,
  Moon,
  Sun,
  Bell,
  BellRing,
  BellOff,
  Lock,
  Key,
  Globe,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Configurações de aparência
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#0F3B5E');
  const [compactMode, setCompactMode] = useState(false);

  // Configurações de notificações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [leadCreated, setLeadCreated] = useState(true);
  const [negotiationUpdated, setNegotiationUpdated] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // Configurações de segurança
  const [passwordExpiration, setPasswordExpiration] = useState(90);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

  // Configurações de sistema
  const [systemName, setSystemName] = useState('AnalyticsPro');
  const [supportEmail, setSupportEmail] = useState('suporte@analyticspro.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const tabs = [
    { id: 'general', name: 'Geral', icon: Globe },
    { id: 'appearance', name: 'Aparência', icon: Sun },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'security', name: 'Segurança', icon: Lock },
  ];

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuccess('Configurações salvas com sucesso!');
    setTimeout(() => setSuccess(''), 3000);
    setSaving(false);
  };

  // Se não for admin, redirecionar (protegido pela rota)

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Configurações</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie as configurações do sistema
          </p>
        </div>

        {/* Mensagens */}
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar com abas */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="card overflow-hidden">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors mb-1
                        ${activeTab === tab.id
                          ? 'bg-[#0F3B5E]/10 text-[#0F3B5E]'
                          : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={18} />
                        <span>{tab.name}</span>
                      </div>
                      <ChevronRight size={16} className={activeTab === tab.id ? 'text-[#0F3B5E]' : 'text-slate-400'} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Conteúdo da aba */}
          <div className="flex-1">
            <div className="card overflow-hidden">
              {/* Aba Geral */}
              {activeTab === 'general' && (
                <div>
                  <div className="px-6 py-5 border-b border-slate-200">
                    <h2 className="text-sm font-semibold text-slate-800">Configurações Gerais</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nome do Sistema
                      </label>
                      <input
                        type="text"
                        value={systemName}
                        onChange={(e) => setSystemName(e.target.value)}
                        className="input w-full max-w-md"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Email de Suporte
                      </label>
                      <input
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="input w-full max-w-md"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Modo de Manutenção</p>
                          <p className="text-xs text-slate-500">
                            Quando ativo, apenas administradores podem acessar o sistema
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={maintenanceMode}
                          onChange={(e) => setMaintenanceMode(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Aba Aparência */}
              {activeTab === 'appearance' && (
                <div>
                  <div className="px-6 py-5 border-b border-slate-200">
                    <h2 className="text-sm font-semibold text-slate-800">Aparência</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-3">
                        Tema
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setTheme('light')}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            theme === 'light'
                              ? 'border-[#0F3B5E] bg-[#0F3B5E]/5'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Sun size={24} className={theme === 'light' ? 'text-[#0F3B5E]' : 'text-slate-400'} />
                          <span className="text-sm mt-2 block">Claro</span>
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            theme === 'dark'
                              ? 'border-[#0F3B5E] bg-[#0F3B5E]/5'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Moon size={24} className={theme === 'dark' ? 'text-[#0F3B5E]' : 'text-slate-400'} />
                          <span className="text-sm mt-2 block">Escuro</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Cor Primária
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="input flex-1"
                          placeholder="#0F3B5E"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Modo Compacto</p>
                        <p className="text-xs text-slate-500">Reduzir espaçamentos e densidade</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={compactMode}
                          onChange={(e) => setCompactMode(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F3B5E]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Aba Notificações */}
              {activeTab === 'notifications' && (
                <div>
                  <div className="px-6 py-5 border-b border-slate-200">
                    <h2 className="text-sm font-semibold text-slate-800">Notificações</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail size={18} className="text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">Notificações por Email</p>
                            <p className="text-xs text-slate-500">Receber alertas no email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F3B5E]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <BellRing size={18} className="text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">Notificações Push</p>
                            <p className="text-xs text-slate-500">Alertas no navegador</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pushNotifications}
                            onChange={(e) => setPushNotifications(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F3B5E]"></div>
                        </label>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-medium text-slate-600 mb-3">Alertas específicos</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Lead criado</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={leadCreated}
                              onChange={(e) => setLeadCreated(e.target.checked)}
                              className="sr-only peer"
                              disabled={!emailNotifications && !pushNotifications}
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F3B5E] peer-disabled:opacity-50"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Negociação atualizada</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={negotiationUpdated}
                              onChange={(e) => setNegotiationUpdated(e.target.checked)}
                              className="sr-only peer"
                              disabled={!emailNotifications && !pushNotifications}
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F3B5E] peer-disabled:opacity-50"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Resumo diário</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dailyDigest}
                              onChange={(e) => setDailyDigest(e.target.checked)}
                              className="sr-only peer"
                              disabled={!emailNotifications}
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F3B5E] peer-disabled:opacity-50"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Aba Segurança */}
              {activeTab === 'security' && (
                <div>
                  <div className="px-6 py-5 border-b border-slate-200">
                    <h2 className="text-sm font-semibold text-slate-800">Segurança</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Expiração de senha (dias)
                      </label>
                      <select
                        value={passwordExpiration}
                        onChange={(e) => setPasswordExpiration(Number(e.target.value))}
                        className="input w-40"
                      >
                        <option value={30}>30 dias</option>
                        <option value={60}>60 dias</option>
                        <option value={90}>90 dias</option>
                        <option value={180}>180 dias</option>
                        <option value={0}>Nunca</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Timeout da sessão (minutos)
                      </label>
                      <select
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(Number(e.target.value))}
                        className="input w-40"
                      >
                        <option value={15}>15 minutos</option>
                        <option value={30}>30 minutos</option>
                        <option value={60}>1 hora</option>
                        <option value={120}>2 horas</option>
                        <option value={240}>4 horas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Máximo de tentativas de login
                      </label>
                      <select
                        value={maxLoginAttempts}
                        onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                        className="input w-40"
                      >
                        <option value={3}>3 tentativas</option>
                        <option value={5}>5 tentativas</option>
                        <option value={10}>10 tentativas</option>
                        <option value={0}>Ilimitado</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Shield size={20} className="text-[#0F3B5E] mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Autenticação de dois fatores</p>
                          <p className="text-xs text-slate-500">
                            Adiciona uma camada extra de segurança
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={twoFactorAuth}
                          onChange={(e) => setTwoFactorAuth(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F3B5E]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão Salvar */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Salvar configurações</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;