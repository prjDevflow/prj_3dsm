import { Header } from "../../components/Header";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { useClientsModel } from "./clients.model";
import { format } from "date-fns"; // Corrected import
import { ptBR } from "date-fns/locale/pt-BR";

type ClientsViewProps = ReturnType<typeof useClientsModel>;

export const ClientsView = (props: ClientsViewProps) => {
  const {
    isLoading,
    openCreate,
    success,
    search,
    setSearch,
    leadFilter,
    setLeadFilter,
    setPage,
    clients,
    totalPages,
    startItem,
    endItem,
    openEdit,
    setDeleteConfirm,
    deleteConfirm,
    handleDelete,
    showModal,
    formError,
    formData,
    handleFormChange,
    leads,
    isSaving,
    handleSave,
    isAdmin,
    page,
    avatarColor,
    total,
    deleteClientMutation,
    closeModal,
    editingClient,
    atendentes,
  } = props;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Cabeçalho ── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">Clientes</h1>
            <p className="text-sm text-slate-500 mt-1">
              Clientes vinculados aos seus leads
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                <UserCheck size={16} className="text-[var(--color-primary)]" />
                <span className="text-sm font-semibold text-slate-800">
                  {total}
                </span>
                <span className="text-sm text-slate-500">clientes</span>
              </div>
            )}
            <button
              onClick={openCreate}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} /> Novo Cliente
            </button>
          </div>
        </div>

        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-emerald-700 text-sm">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {/* ── Busca e filtros ── */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input w-full pl-9"
            />
          </div>
          <select
            value={leadFilter}
            onChange={(e) => { setLeadFilter(e.target.value as any); setPage(1); }}
            className="input text-sm"
          >
            <option value="all">Todos os clientes</option>
            <option value="with">Com lead vinculado</option>
            <option value="without">Sem lead vinculado</option>
          </select>
        </div>

        {/* ── Tabela ── */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Lead Vinculado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)] mx-auto mb-2" />
                      <p className="text-sm text-slate-500">
                        Carregando clientes...
                      </p>
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <UserCheck
                        size={32}
                        className="mx-auto mb-2 text-slate-300"
                      />
                      <p className="text-sm text-slate-500">
                        Nenhum cliente encontrado
                      </p>
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${avatarColor(client.name)}`}
                          >
                            <span className="text-white text-xs font-semibold">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-800">
                            {client.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">{client.email}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {client.phone}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {client.cpf || (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {client.leadId ? (
                          <a
                            href={`/leads/${client.leadId}`}
                            className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline font-medium"
                          >
                            {leads.find((l) => l.id === client.leadId)?.name ?? client.leadId}{" "}
                            <ArrowUpRight size={11} />
                          </a>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {client.createdAt ? format(new Date(client.createdAt), "dd MMM yyyy", {
                          locale: ptBR,
                        }) : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(client)}
                            className="btn-secondary px-2.5 py-1.5"
                          >
                            <Edit2 size={14} />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() =>
                                setDeleteConfirm(
                                  deleteConfirm === client.id
                                    ? null
                                    : client.id,
                                )
                              }
                              className="p-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Confirmação delete inline */}
          {deleteConfirm && (
            <div className="border-t border-rose-100 bg-rose-50 px-6 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-rose-700">
                Remover este cliente? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteClientMutation.isPending}
                  className="text-xs px-3 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1.5"
                >
                  {deleteClientMutation.isPending ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    "Confirmar"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Paginação */}
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
            <p className="text-sm text-slate-500">
              {total === 0
                ? "Nenhum resultado"
                : `Mostrando ${startItem}–${endItem} de ${total} clientes`}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {(() => {
                  const pages: (number | "...")[] = [];
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (page > 3) pages.push("...");
                    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
                    if (page < totalPages - 2) pages.push("...");
                    pages.push(totalPages);
                  }
                  return pages.map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          page === p
                            ? "bg-[var(--color-primary)] text-white"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  );
                })()}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Modal criar/editar ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                {editingClient ? "Editar Cliente" : "Novo Cliente"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name ?? ""}
                  onChange={(e) =>
                    handleFormChange("name", e.target.value)
                  }
                  className="input w-full"
                  placeholder="Nome completo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email ?? ""}
                    onChange={(e) =>
                      handleFormChange("email", e.target.value)
                    }
                    className="input w-full"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formData.phone ?? ""}
                    onChange={(e) =>
                      handleFormChange("phone", e.target.value)
                    }
                    className="input w-full"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpf ?? ""}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                    const masked = digits
                      .replace(/(\d{3})(\d)/, "$1.$2")
                      .replace(/(\d{3})(\d)/, "$1.$2")
                      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                    handleFormChange("cpf", masked);
                  }}
                  className="input w-full"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Lead Vinculado
                </label>
                <select
                  value={formData.leadId ?? ""}
                  onChange={(e) => handleFormChange("leadId", e.target.value)}
                  className="input w-full"
                >
                  <option value="">Sem lead vinculado</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.status} — {l.store ?? ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Consultor Responsável
                </label>
                <select
                  value={formData.consultorId ?? ""}
                  onChange={(e) => handleFormChange("consultorId", e.target.value)}
                  className="input w-full"
                >
                  <option value="">Sem consultor</option>
                  {atendentes.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role === "gerente" ? "Gerente" : "Atendente"})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="btn-secondary"
              >
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
                {editingClient ? "Salvar" : "Criar Cliente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
