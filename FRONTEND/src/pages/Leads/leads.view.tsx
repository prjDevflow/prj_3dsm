import { Header } from "../../components/Header";
import LeadsTable from "../../components/LeadsTable";
import {
  AlertCircle,
  Plus,
  X,
  CheckCircle,
  Loader2,
  Clock,
  CheckSquare,
  Download,
  Upload,
  FileSpreadsheet,
} from "lucide-react";
import { useLeadsModel, LeadTab } from "./leads.model";


const TEAMS = [
  { value: "all",           label: "Todas as equipes" },
  { value: "Equipe Alpha",  label: "Equipe Alpha" },
  { value: "Equipe Beta",   label: "Equipe Beta" },
];

const ORIGINS = [
  "Site", "WhatsApp", "Instagram", "Facebook",
  "Indicação", "Loja Física", "Mercado Livre",
];

const TABS: { key: LeadTab; label: string; icon: React.ElementType; color: string }[] = [
  { key: "novos",       label: "Novos",        icon: Plus,        color: "text-blue-600 border-blue-500 bg-blue-50" },
  { key: "andamento",   label: "Em Andamento", icon: Clock,       color: "text-amber-600 border-amber-500 bg-amber-50" },
  { key: "finalizados", label: "Finalizados",  icon: CheckSquare, color: "text-emerald-600 border-emerald-500 bg-emerald-50" },
];

type LeadsViewProps = ReturnType<typeof useLeadsModel>;

export const LeadsView = (props: LeadsViewProps) => {
  const {
    error,
    data,
    setPage,
    handleFilter,
    handleSearch,
    isLoading,
    showModal,
    closeModal,
    openCreate,
    openEdit,
    formData,
    handleFormChange,
    handleSave,
    formError,
    success,
    isSaving,
    atendentes,
    isAdmin,
    isGerente,
    canCreate,
    editingLead,
    onDateRangeChange,
    onStoreChange,
    onTeamChange,
    store,
    team,
    activeTab,
    switchTab,
    counts,
    lojas,
    duplicateWarning,
    exportCSV,
    importFileRef,
    importPreview,
    showImportModal,
    setShowImportModal,
    importing,
    importResult,
    handleImportFile,
    handleImportSubmit,
  } = props;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-rose-50 p-8 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-600">Erro ao carregar leads</p>
          </div>
        </div>
      </div>
    );
  }

  const activeTabConfig = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Cabeçalho ── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">Leads</h1>
            <p className="text-sm text-slate-500 mt-1">Gerencie e acompanhe todos os seus leads</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={store}
              onChange={(e) => onStoreChange(e.target.value)}
              className="input text-sm py-2"
            >
              <option value="all">Todas as lojas</option>
              {lojas.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={team}
              onChange={(e) => onTeamChange(e.target.value)}
              className="input text-sm py-2"
            >
              {TEAMS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-emerald-700 text-sm">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        {/* ── Cards de contagem ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {TABS.map((tab) => {
            const Icon  = tab.icon;
            const count = counts[tab.key];
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => switchTab(tab.key)}
                className={`card p-4 text-left transition-all border-2 ${
                  isActive
                    ? tab.color + " shadow-md"
                    : "border-transparent hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {tab.label}
                  </span>
                  <Icon size={16} className={isActive ? "" : "text-slate-400"} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{count}</p>
                <p className="text-xs text-slate-400 mt-0.5">leads</p>
              </button>
            );
          })}
        </div>

        {/* ── Aba ativa — barra superior ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-5 rounded-full ${
              activeTab === "novos"       ? "bg-blue-500"
              : activeTab === "andamento" ? "bg-amber-500"
              : "bg-emerald-500"
            }`} />
            <h2 className="text-base font-semibold text-slate-700">
              {activeTabConfig.label}
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({counts[activeTab]} leads)
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm" title="Exportar leads visíveis como CSV">
              <Download size={15} /> Exportar CSV
            </button>
            {(isAdmin || isGerente) && (
              <label className="btn-secondary flex items-center gap-2 text-sm cursor-pointer" title="Importar leads de um arquivo CSV">
                <Upload size={15} /> Importar CSV
                <input ref={importFileRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
              </label>
            )}
            {activeTab === "novos" && canCreate && (
              <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> Novo Lead
              </button>
            )}
          </div>
        </div>

        {/* ── Tabela ── */}
        <LeadsTable
          leads={data?.data || []}
          total={data?.total || 0}
          page={data?.page || 1}
          limit={data?.limit || 10}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onEdit={canCreate ? openEdit : undefined}
          loading={isLoading}
          activeTab={activeTab}
        />
      </main>

      {/* ── Modal criar/editar lead ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                {editingLead ? "Editar Lead" : "Novo Lead"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                  <AlertCircle size={14} /> {formError}
                </div>
              )}

              {editingLead && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-lg text-xs">
                  <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                  <span>Ao editar, apenas Loja, Origem e Atendente podem ser alterados.</span>
                </div>
              )}

              {duplicateWarning && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2.5 rounded-lg text-sm">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>
                    Possível duplicata: já existe um lead com este <strong>{duplicateWarning.field}</strong> —{" "}
                    <strong>{duplicateWarning.name}</strong> ({duplicateWarning.status}). Você pode continuar mesmo assim.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="input w-full disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder="Nome da empresa ou contato"
                    disabled={!!editingLead}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className="input w-full disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder="email@empresa.com"
                    disabled={!!editingLead}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    className="input w-full disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder="(00) 00000-0000"
                    disabled={!!editingLead}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Origem
                  </label>
                  <select
                    value={formData.origin}
                    onChange={(e) => handleFormChange("origin", e.target.value)}
                    className="input w-full"
                  >
                    {ORIGINS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Loja
                  </label>
                  <select
                    value={formData.store}
                    onChange={(e) => handleFormChange("store", e.target.value)}
                    className="input w-full"
                  >
                    {lojas.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                {(isAdmin || isGerente) && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                      Atendente Responsável
                    </label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => handleFormChange("assignedTo", e.target.value)}
                      className="input w-full"
                    >
                      <option value="">Selecionar atendente...</option>
                      {atendentes.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={closeModal} className="btn-secondary">Cancelar</button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving
                  ? <Loader2 size={15} className="animate-spin" />
                  : <CheckCircle size={15} />}
                {editingLead ? "Salvar" : "Criar Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal importação CSV ── */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-[var(--color-primary)]" />
                <h2 className="text-base font-semibold text-slate-800">Importar Leads via CSV</h2>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {!importResult ? (
                <>
                  <p className="text-sm text-slate-500 mb-1">
                    <strong>{importPreview.length}</strong> linha{importPreview.length !== 1 ? 's' : ''} detectada{importPreview.length !== 1 ? 's' : ''}.
                    Colunas esperadas: <code className="text-xs bg-slate-100 px-1 rounded">nome, email, telefone, loja, origem, atendente</code>
                  </p>
                  <p className="text-xs text-slate-400 mb-4">Lojas e origens devem corresponder exatamente aos cadastrados. Atendente é opcional.</p>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          {['name','email','phone','store','origin','assignedTo'].map((h) => (
                            <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importPreview.slice(0, 10).map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            {['name','email','phone','store','origin','assignedTo'].map((f) => (
                              <td key={f} className={`px-3 py-1.5 text-slate-700 max-w-[120px] truncate ${!row[f] && f !== 'assignedTo' ? 'text-rose-400 italic' : ''}`}>
                                {row[f] || (f === 'assignedTo' ? '—' : 'vazio')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 10 && (
                      <p className="text-xs text-slate-400 text-center py-2">
                        + {importPreview.length - 10} linha{importPreview.length - 10 > 1 ? 's' : ''} não exibida{importPreview.length - 10 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-emerald-500" />
                    <p className="text-sm font-semibold text-slate-800">
                      {importResult.created} lead{importResult.created !== 1 ? 's' : ''} criado{importResult.created !== 1 ? 's' : ''} com sucesso.
                    </p>
                  </div>
                  {importResult.errors.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-rose-600 mb-2">{importResult.errors.length} erro{importResult.errors.length > 1 ? 's' : ''}:</p>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {importResult.errors.map((e, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">
                            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                            <span>Linha {e.row}: {e.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowImportModal(false)} className="btn-secondary">
                {importResult ? 'Fechar' : 'Cancelar'}
              </button>
              {!importResult && (
                <button
                  onClick={handleImportSubmit}
                  disabled={importing || importPreview.length === 0}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {importing ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  {importing ? 'Importando...' : `Importar ${importPreview.length} leads`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
