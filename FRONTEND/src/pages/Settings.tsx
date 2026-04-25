import { useState } from 'react';
import Header from '../components/Header';
import {
  Save, Moon, Sun, Bell, BellRing, Mail,
  Globe, Loader2, CheckCircle, AlertCircle, ChevronRight,
} from 'lucide-react';
import {
  loadSettings, saveSettings, applySettings, AppSettings,
} from '../services/settingsService';

const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}> = ({ checked, onChange, disabled = false, size = 'md' }) => {
  const track = size === 'sm'
    ? 'w-9 h-5 after:h-4 after:w-4 after:top-[2px] after:left-[2px]'
    : 'w-11 h-6 after:h-5 after:w-5 after:top-[2px] after:left-[2px]';
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div
        className={`${track} bg-slate-200 rounded-full peer
          peer-checked:after:translate-x-full
          after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all
          peer-checked:bg-[var(--color-primary)] peer-disabled:opacity-50 peer-disabled:cursor-not-allowed`}
        style={{ ['--color-primary' as string]: 'var(--color-primary)' }}
      />
    </label>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState('');
  const [error, setError]         = useState('');

  const [cfg, setCfg] = useState<AppSettings>(loadSettings);

  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
    setCfg(prev => ({ ...prev, [key]: value }));

  const tabs = [
    { id: 'general',       name: 'Geral',        icon: Globe },
    { id: 'appearance',    name: 'Aparência',     icon: Sun   },
    { id: 'notifications', name: 'Notificações',  icon: Bell  },
  ];

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      saveSettings(cfg);
      applySettings(cfg);
      setSuccess('Configurações salvas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Erro ao salvar as configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">Configurações</h1>
          <p className="text-sm text-slate-500 mt-1">Personalize o sistema conforme sua preferência</p>
        </div>

        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center text-emerald-700">
            <CheckCircle size={18} className="mr-3 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center text-rose-700">
            <AlertCircle size={18} className="mr-3 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar ── */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="card overflow-hidden">
              <nav className="p-2">
                {tabs.map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors mb-1
                      ${activeTab === id
                        ? 'bg-[var(--color-primary-10)] text-[var(--color-primary)] font-medium'
                        : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} />
                      <span>{name}</span>
                    </div>
                    <ChevronRight size={15} className={activeTab === id ? 'text-[var(--color-primary)]' : 'text-slate-300'} />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* ── Conteúdo ── */}
          <div className="flex-1">
            <div className="card overflow-hidden">

              {/* ── Geral ── */}
              {activeTab === 'general' && (
                <div>
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-800">Configurações Gerais</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Informações básicas do sistema</p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Nome do Sistema
                      </label>
                      <input
                        type="text"
                        value={cfg.systemName}
                        onChange={(e) => set('systemName', e.target.value)}
                        className="input w-full max-w-sm"
                        placeholder="AnalyticsPro"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Email de Suporte
                      </label>
                      <div className="relative max-w-sm">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={cfg.supportEmail}
                          onChange={(e) => set('supportEmail', e.target.value)}
                          className="input w-full pl-9"
                          placeholder="suporte@empresa.com"
                        />
                      </div>
                    </div>

                    <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                      cfg.maintenanceMode ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <AlertCircle size={18} className={cfg.maintenanceMode ? 'text-amber-500 mt-0.5' : 'text-slate-400 mt-0.5'} />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Modo de Manutenção</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Apenas administradores conseguem acessar o sistema
                          </p>
                        </div>
                      </div>
                      <Toggle
                        checked={cfg.maintenanceMode}
                        onChange={(v) => set('maintenanceMode', v)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Aparência ── */}
              {activeTab === 'appearance' && (
                <div>
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-800">Aparência</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Tema, cores e densidade da interface</p>
                  </div>
                  <div className="p-6 space-y-6">

                    {/* Tema */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Tema
                      </label>
                      <div className="grid grid-cols-2 gap-3 max-w-xs">
                        {([
                          { value: 'light', label: 'Claro',  Icon: Sun  },
                          { value: 'dark',  label: 'Escuro', Icon: Moon },
                        ] as const).map(({ value, label, Icon }) => (
                          <button
                            key={value}
                            onClick={() => set('theme', value)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              cfg.theme === value
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-5)]'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <Icon size={22} className={cfg.theme === value ? 'text-[var(--color-primary)]' : 'text-slate-400'} />
                            <span className={`text-sm font-medium ${cfg.theme === value ? 'text-[var(--color-primary)]' : 'text-slate-500'}`}>
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cor primária */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Cor Primária
                      </label>
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="relative">
                          <input
                            type="color"
                            value={cfg.primaryColor}
                            onChange={(e) => set('primaryColor', e.target.value)}
                            className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                          />
                        </div>
                        <input
                          type="text"
                          value={cfg.primaryColor}
                          onChange={(e) => set('primaryColor', e.target.value)}
                          className="input flex-1 font-mono text-sm"
                          placeholder="#0F3B5E"
                          maxLength={7}
                        />
                        <button
                          onClick={() => set('primaryColor', '#0F3B5E')}
                          className="btn-secondary text-xs px-3 whitespace-nowrap"
                          title="Restaurar padrão"
                        >
                          Padrão
                        </button>
                      </div>
                    </div>

                    {/* Modo compacto */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Modo Compacto</p>
                        <p className="text-xs text-slate-500 mt-0.5">Reduz espaçamentos para mais densidade</p>
                      </div>
                      <Toggle
                        checked={cfg.compactMode}
                        onChange={(v) => set('compactMode', v)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Notificações ── */}
              {activeTab === 'notifications' && (
                <div>
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-800">Notificações</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Controle como e quando você é notificado</p>
                  </div>
                  <div className="p-6 space-y-6">

                    {/* Canais */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Canais</p>
                      <div className="space-y-3">
                        {([
                          { key: 'emailNotifications', Icon: Mail,    label: 'Email',    desc: 'Receba alertas no seu email' },
                          { key: 'pushNotifications',  Icon: BellRing, label: 'Push',    desc: 'Notificações no navegador' },
                        ] as const).map(({ key, Icon, label, desc }) => (
                          <div key={key} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg border border-slate-200">
                                <Icon size={16} className="text-slate-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">{label}</p>
                                <p className="text-xs text-slate-500">{desc}</p>
                              </div>
                            </div>
                            <Toggle checked={cfg[key]} onChange={(v) => set(key, v)} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Eventos */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Eventos</p>
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                        {([
                          { key: 'leadCreated',         label: 'Novo lead criado',          desc: 'Quando um lead é adicionado ao sistema' },
                          { key: 'negotiationUpdated',  label: 'Negociação atualizada',     desc: 'Quando há atividade numa negociação' },
                          { key: 'dailyDigest',         label: 'Resumo diário',             desc: 'Sumário do dia enviado por email' },
                        ] as const).map(({ key, label, desc }) => {
                          const disabled = key === 'dailyDigest'
                            ? !cfg.emailNotifications
                            : (!cfg.emailNotifications && !cfg.pushNotifications);
                          return (
                            <div key={key} className={`flex items-center justify-between px-4 py-3.5 bg-white ${disabled ? 'opacity-50' : ''}`}>
                              <div>
                                <p className="text-sm font-medium text-slate-700">{label}</p>
                                <p className="text-xs text-slate-500">{desc}</p>
                              </div>
                              <Toggle
                                size="sm"
                                checked={cfg[key]}
                                onChange={(v) => set(key, v)}
                                disabled={disabled}
                              />
                            </div>
                          );
                        })}
                      </div>
                      {(!cfg.emailNotifications && !cfg.pushNotifications) && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                          <AlertCircle size={12} />
                          Ative ao menos um canal para habilitar os eventos.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Botão Salvar ── */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <p className="text-xs text-slate-400">As alterações são aplicadas imediatamente ao salvar.</p>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  {saving ? (
                    <><Loader2 size={15} className="animate-spin" /><span>Salvando...</span></>
                  ) : (
                    <><Save size={15} /><span>Salvar</span></>
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
