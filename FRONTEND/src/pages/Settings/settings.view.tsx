import { Header } from "../../components/Header";
import {
  Save,
  Moon,
  Sun,
  BellRing,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Trash2,
  Store,
} from "lucide-react";
import { Toggle } from "./components/Toggle";
import { useSettingsModel } from "./settings.model";

type SettingsViewProps = ReturnType<typeof useSettingsModel>;

export const SettingsView = (props: SettingsViewProps) => {
  const {
    success,
    error,
    tabs,
    setActiveTab,
    activeTab,
    cfg,
    handleSave,
    saving,
    set,
    lojas,
    origens,
    newLoja,
    setNewLoja,
    newOrigem,
    setNewOrigem,
    loadingData,
    dataError,
    handleAddLoja,
    handleDeleteLoja,
    handleAddOrigem,
    handleDeleteOrigem,
  } = props;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">
            Configurações
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Personalize o sistema conforme sua preferência
          </p>
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
                      ${
                        activeTab === id
                          ? "bg-[var(--color-primary-10)] text-[var(--color-primary)] font-medium"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} />
                      <span>{name}</span>
                    </div>
                    <ChevronRight
                      size={15}
                      className={
                        activeTab === id
                          ? "text-[var(--color-primary)]"
                          : "text-slate-300"
                      }
                    />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* ── Conteúdo ── */}
          <div className="flex-1">
            <div className="card overflow-hidden">
              {/* ── Geral ── */}
              {activeTab === "general" && (
                <div>
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-800">
                      Configurações Gerais
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Informações básicas do sistema
                    </p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Nome do Sistema
                      </label>
                      <input
                        type="text"
                        value={cfg.systemName}
                        onChange={(e) => set("systemName", e.target.value)}
                        className="input w-full max-w-sm"
                        placeholder="AnalyticsPro"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Email de Suporte
                      </label>
                      <div className="relative max-w-sm">
                        <Mail
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="email"
                          value={cfg.supportEmail}
                          onChange={(e) => set("supportEmail", e.target.value)}
                          className="input w-full pl-9"
                          placeholder="suporte@empresa.com"
                        />
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                        cfg.maintenanceMode
                          ? "bg-amber-50 border-amber-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          size={18}
                          className={
                            cfg.maintenanceMode
                              ? "text-amber-500 mt-0.5"
                              : "text-slate-400 mt-0.5"
                          }
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Modo de Manutenção
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Apenas administradores conseguem acessar o sistema
                          </p>
                        </div>
                      </div>
                      <Toggle
                        checked={cfg.maintenanceMode}
                        onChange={(v) => set("maintenanceMode", v)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Aparência ── */}
              {activeTab === "appearance" && (
                <div>
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-800">
                      Aparência
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tema, cores e densidade da interface
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Tema */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Tema
                      </label>
                      <div className="grid grid-cols-2 gap-3 max-w-xs">
                        {(
                          [
                            { value: "light", label: "Claro", Icon: Sun },
                            { value: "dark", label: "Escuro", Icon: Moon },
                          ] as const
                        ).map(({ value, label, Icon }) => (
                          <button
                            key={value}
                            onClick={() => set("theme", value)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              cfg.theme === value
                                ? "border-[var(--color-primary)] bg-[var(--color-primary-5)]"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <Icon
                              size={22}
                              className={
                                cfg.theme === value
                                  ? "text-[var(--color-primary)]"
                                  : "text-slate-400"
                              }
                            />
                            <span
                              className={`text-sm font-medium ${cfg.theme === value ? "text-[var(--color-primary)]" : "text-slate-500"}`}
                            >
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
                            onChange={(e) =>
                              set("primaryColor", e.target.value)
                            }
                            className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                          />
                        </div>
                        <input
                          type="text"
                          value={cfg.primaryColor}
                          onChange={(e) => set("primaryColor", e.target.value)}
                          className="input flex-1 font-mono text-sm"
                          placeholder="#0F3B5E"
                          maxLength={7}
                        />
                        <button
                          onClick={() => set("primaryColor", "#0F3B5E")}
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
                        <p className="text-sm font-medium text-slate-700">
                          Modo Compacto
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Reduz espaçamentos para mais densidade
                        </p>
                      </div>
                      <Toggle
                        checked={cfg.compactMode}
                        onChange={(v) => set("compactMode", v)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Notificações ── */}
              {activeTab === "notifications" && (
                <div>
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-800">
                      Notificações
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Controle como e quando você é notificado
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Canais */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Canais
                      </p>
                      <div className="space-y-3">
                        {(
                          [
                            {
                              key: "emailNotifications",
                              Icon: Mail,
                              label: "Email",
                              desc: "Receba alertas no seu email",
                            },
                            {
                              key: "pushNotifications",
                              Icon: BellRing,
                              label: "Push",
                              desc: "Notificações no navegador",
                            },
                          ] as const
                        ).map(({ key, Icon, label, desc }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg border border-slate-200">
                                <Icon size={16} className="text-slate-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {label}
                                </p>
                                <p className="text-xs text-slate-500">{desc}</p>
                              </div>
                            </div>
                            <Toggle
                              checked={cfg[key]}
                              onChange={(v) => set(key, v)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Eventos */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Eventos
                      </p>
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                        {(
                          [
                            {
                              key: "leadCreated",
                              label: "Novo lead criado",
                              desc: "Quando um lead é adicionado ao sistema",
                            },
                            {
                              key: "negotiationUpdated",
                              label: "Negociação atualizada",
                              desc: "Quando há atividade numa negociação",
                            },
                            {
                              key: "dailyDigest",
                              label: "Resumo diário",
                              desc: "Sumário do dia enviado por email",
                            },
                          ] as const
                        ).map(({ key, label, desc }) => {
                          const disabled =
                            key === "dailyDigest"
                              ? !cfg.emailNotifications
                              : !cfg.emailNotifications &&
                                !cfg.pushNotifications;
                          return (
                            <div
                              key={key}
                              className={`flex items-center justify-between px-4 py-3.5 bg-white ${disabled ? "opacity-50" : ""}`}
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {label}
                                </p>
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
                      {!cfg.emailNotifications && !cfg.pushNotifications && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                          <AlertCircle size={12} />
                          Ative ao menos um canal para habilitar os eventos.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Lojas & Origens ── */}
              {activeTab === "data" && (
                <div>
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Store size={16} className="text-[var(--color-primary)]" />
                      Lojas &amp; Origens
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Gerencie as lojas e origens disponíveis no sistema
                    </p>
                  </div>
                  {loadingData ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
                    </div>
                  ) : (
                    <div className="p-6 space-y-8">
                      {dataError && (
                        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                          <AlertCircle size={14} /> {dataError}
                        </div>
                      )}

                      {/* Lojas */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                          Lojas ({lojas.length})
                        </p>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newLoja}
                            onChange={(e) => setNewLoja(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddLoja()}
                            placeholder="Nome da loja..."
                            className="input flex-1 text-sm"
                          />
                          <button
                            onClick={handleAddLoja}
                            disabled={!newLoja.trim()}
                            className="btn-primary flex items-center gap-1.5 text-sm disabled:opacity-50"
                          >
                            <Plus size={14} /> Adicionar
                          </button>
                        </div>
                        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                          {lojas.length === 0 ? (
                            <p className="text-sm text-slate-400 italic p-4">Nenhuma loja cadastrada.</p>
                          ) : (
                            lojas.map((l) => (
                              <div key={l.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50">
                                <span className="text-sm text-slate-700">{l.nome}</span>
                                <button
                                  onClick={() => handleDeleteLoja(l.id)}
                                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Origens */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                          Origens ({origens.length})
                        </p>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newOrigem}
                            onChange={(e) => setNewOrigem(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddOrigem()}
                            placeholder="Nome da origem..."
                            className="input flex-1 text-sm"
                          />
                          <button
                            onClick={handleAddOrigem}
                            disabled={!newOrigem.trim()}
                            className="btn-primary flex items-center gap-1.5 text-sm disabled:opacity-50"
                          >
                            <Plus size={14} /> Adicionar
                          </button>
                        </div>
                        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                          {origens.length === 0 ? (
                            <p className="text-sm text-slate-400 italic p-4">Nenhuma origem cadastrada.</p>
                          ) : (
                            origens.map((o) => (
                              <div key={o.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50">
                                <span className="text-sm text-slate-700">{o.nome}</span>
                                <button
                                  onClick={() => handleDeleteOrigem(o.id)}
                                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Botão Salvar ── */}
              {activeTab !== "data" && <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  As alterações são aplicadas imediatamente ao salvar.
                </p>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      <span>Salvar</span>
                    </>
                  )}
                </button>
              </div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
