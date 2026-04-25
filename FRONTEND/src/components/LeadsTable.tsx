import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lead } from '../types';
import { ChevronLeft, ChevronRight, Search, Loader2, X, ArrowUpRight, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LeadsTableProps {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => void;
  onFilter?: (filters: { status?: string; importance?: string }) => void;
  onEdit?: (lead: Lead) => void;
  loading?: boolean;
}

const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  novo:        { label: 'Novo',        dot: 'bg-blue-400',    classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  contatado:   { label: 'Contatado',   dot: 'bg-amber-400',   classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  qualificado: { label: 'Qualificado', dot: 'bg-purple-400',  classes: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' },
  perdido:     { label: 'Perdido',     dot: 'bg-rose-400',    classes: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' },
  ganho:       { label: 'Ganho',       dot: 'bg-emerald-400', classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
};

const importanceConfig: Record<string, { label: string; classes: string }> = {
  baixa: { label: 'Baixa', classes: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' },
  media: { label: 'Média', classes: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' },
  alta:  { label: 'Alta',  classes: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' },
};

const avatarColors = [
  'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500',
];
const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads, total, page, limit, totalPages,
  onPageChange, onSearch, onFilter, onEdit, loading = false,
}) => {
  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [importanceFilter, setImportanceFilter] = useState('');

  const hasActiveFilters = !!(statusFilter || importanceFilter || searchTerm);

  const handleSearch = () => onSearch?.(searchTerm);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onFilter?.({ status: value || undefined, importance: importanceFilter || undefined });
  };

  const handleImportanceChange = (value: string) => {
    setImportanceFilter(value);
    onFilter?.({ status: statusFilter || undefined, importance: value || undefined });
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setStatusFilter('');
    setImportanceFilter('');
    onSearch?.('');
    onFilter?.({});
  };

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem   = Math.min(page * limit, total);

  return (
    <div className="card overflow-hidden">

      {/* ── Barra de busca e filtros ── */}
      <div className="p-4 border-b border-slate-100 bg-white">
        <div className="flex flex-col sm:flex-row gap-3">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="input w-full pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="input sm:w-44 text-sm"
          >
            <option value="">Todos os status</option>
            <option value="novo">Novo</option>
            <option value="contatado">Contatado</option>
            <option value="qualificado">Qualificado</option>
            <option value="perdido">Perdido</option>
            <option value="ganho">Ganho</option>
          </select>

          <select
            value={importanceFilter}
            onChange={(e) => handleImportanceChange(e.target.value)}
            className="input sm:w-40 text-sm"
          >
            <option value="">Importância</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>

          <button onClick={handleSearch} className="btn-primary whitespace-nowrap">
            Buscar
          </button>

          {hasActiveFilters && (
            <button onClick={handleClearAll} className="btn-secondary px-3" title="Limpar filtros">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Tabela ── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contato</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Importância</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Origem</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Criado em</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)] mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Carregando leads...</p>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center text-slate-400">
                    <Search size={32} className="mb-2 opacity-40" />
                    <p className="text-sm font-medium">Nenhum lead encontrado</p>
                    {hasActiveFilters && (
                      <button onClick={handleClearAll} className="mt-2 text-xs text-[var(--color-primary)] hover:underline">
                        Limpar filtros
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const status     = statusConfig[lead.status];
                const importance = importanceConfig[lead.importance];
                return (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">

                    {/* Lead */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getAvatarColor(lead.name)}`}>
                          <span className="text-white text-xs font-semibold">{lead.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-800">{lead.name}</span>
                      </div>
                    </td>

                    {/* Contato */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{lead.email}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{lead.phone}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {status && (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      )}
                    </td>

                    {/* Importância */}
                    <td className="px-6 py-4">
                      {importance && (
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${importance.classes}`}>
                          {importance.label}
                        </span>
                      )}
                    </td>

                    {/* Origem */}
                    <td className="px-6 py-4 text-sm text-slate-600">{lead.origin}</td>

                    {/* Data */}
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {format(new Date(lead.createdAt), "dd MMM yyyy", { locale: ptBR })}
                    </td>

                    {/* Ação */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(lead)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                          >
                            <Pencil size={13} />
                          </button>
                        )}
                        <Link
                          to={`/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary)]"
                        >
                          Detalhes <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Paginação ── */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
        <p className="text-sm text-slate-500">
          {total === 0
            ? 'Nenhum resultado'
            : `Mostrando ${startItem}–${endItem} de ${total} leads`}
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange(p as number)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                      ${page === p
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;
