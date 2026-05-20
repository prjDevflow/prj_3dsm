import { Header } from "../../components/Header";
import LeadsTable from "../../components/LeadsTable";
import { Lead } from "../../types";
import {
  AlertCircle,
  Plus,
  X,
  CheckCircle,
  Loader2,
  Users,
} from "lucide-react";
import { useLeadsModel } from "./leads.model";

const ORIGINS = [
  "Site",
  "WhatsApp",
  "Instagram",
  "Facebook",
  "Indicação",
  "Loja Física",
  "Mercado Livre",
];
const STORES = [
  { value: "Matriz Jacareí",           label: "Matriz Jacareí" },
  { value: "Filial São José dos Campos", label: "Filial São José dos Campos" },
  { value: "Loja Padrão CSV",           label: "Loja Padrão CSV" },
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
  } = props;

  const headerProps = {
    onDateRangeChange,
    onStoreChange,
    onTeamChange,
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header {...headerProps} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-rose-50 p-8 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-600">Erro ao carregar leads</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header {...headerProps} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">Leads</h1>
            <p className="text-sm text-slate-500 mt-1">
              Gerencie e acompanhe todos os seus leads
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && data && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                <Users size={16} className="text-[var(--color-primary)]" />
                <span className="text-sm font-semibold text-slate-800">
                  {data.total}
                </span>
                <span className="text-sm text-slate-500">
                  leads encontrados
                </span>
              </div>
            )}
            {canCreate && (
              <button
                onClick={openCreate}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} /> Novo Lead
              </button>
            )}
          </div>
        </div>

        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-emerald-700 text-sm">
            <CheckCircle size={16} /> {success}
          </div>
        )}

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
        />
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                {editingLead ? "Editar Lead" : "Novo Lead"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                  <AlertCircle size={14} /> {formError}
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
                    className="input w-full"
                    placeholder="Nome da empresa ou contato"
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
                    className="input w-full"
                    placeholder="email@empresa.com"
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
                    className="input w-full"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleFormChange(
                        "status",
                        e.target.value as Lead["status"],
                      )
                    }
                    className="input w-full"
                  >
                    <option value="novo">Novo</option>
                    <option value="contatado">Contatado</option>
                    <option value="qualificado">Qualificado</option>
                    <option value="perdido">Perdido</option>
                    <option value="ganho">Ganho</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Importância
                  </label>
                  <select
                    value={formData.importance}
                    onChange={(e) =>
                      handleFormChange(
                        "importance",
                        e.target.value as Lead["importance"],
                      )
                    }
                    className="input w-full"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
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
                      <option key={o} value={o}>
                        {o}
                      </option>
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
                    {STORES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
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
                      onChange={(e) =>
                        handleFormChange("assignedTo", e.target.value)
                      }
                      className="input w-full"
                    >
                      <option value="">Selecionar atendente...</option>
                      {atendentes.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={closeModal} className="btn-secondary">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <CheckCircle size={15} />
                )}
                {editingLead ? "Salvar" : "Criar Lead"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
