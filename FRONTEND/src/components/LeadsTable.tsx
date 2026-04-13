import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lead } from '../types';
import { ChevronLeft, ChevronRight, Search, Loader2, X } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => void;
  onFilter?: (filters: { status?: string; importance?: string }) => void;
  loading?: boolean;
  showFilters?: boolean;
}

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  total,
  page,
  limit,
  totalPages,
  onPageChange,
  onSearch,
  onFilter,
  loading = false,
  showFilters = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [importanceFilter, setImportanceFilter] = useState<string>('');

  const handleSearch = () => {
    onSearch?.(searchTerm);
  };

  const handleFilterApply = () => {
    onFilter?.({
      status: statusFilter || undefined,
      importance: importanceFilter || undefined,
    });
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setImportanceFilter('');
    onFilter?.({});
  };

  const statusColors = {
    novo: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    contatado: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    qualificado: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    perdido: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
    ganho: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  };

  const importanceColors = {
    baixa: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    media: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    alta: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="card overflow-hidden">
      {/* Header with search */}
      <div className="p-4 border-b border-custom">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="input w-full pl-10"
            />
            <Search className="absolute left-3 top-2.5 text-secondary" size={18} />
          </div>
          <button
            onClick={handleSearch}
            className="btn-primary"
          >
            Buscar
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-secondary rounded-lg border border-custom">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Todos</option>
                  <option value="novo">Novo</option>
                  <option value="contatado">Contatado</option>
                  <option value="qualificado">Qualificado</option>
                  <option value="perdido">Perdido</option>
                  <option value="ganho">Ganho</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">
                  Importância
                </label>
                <select
                  value={importanceFilter}
                  onChange={(e) => setImportanceFilter(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Todas</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleFilterApply}
                  className="btn-primary flex-1"
                >
                  Aplicar
                </button>
                <button
                  onClick={handleClearFilters}
                  className="btn-secondary px-3"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary">
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Lead</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Contato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Importância</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Origem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-custom">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0F3B5E] mx-auto mb-2" />
                  <p className="text-sm text-secondary">Carregando leads...</p>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-secondary">
                  Nenhum lead encontrado.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-hover-bg transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-primary">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-secondary">{lead.email}</div>
                    <div className="text-xs text-secondary opacity-75">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${importanceColors[lead.importance]}`}>
                      {lead.importance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {lead.origin}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="text-sm text-[#0F3B5E] dark:text-[#2C7DA0] hover:text-[#1E5A7A] dark:hover:text-[#4A9FD8] font-medium"
                    >
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-custom flex items-center justify-between">
          <p className="text-sm text-secondary">
            Mostrando {startItem}-{endItem} de {total}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-custom text-secondary hover:bg-hover-bg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="text-sm text-secondary px-2">
              Página {page} de {totalPages}
            </span>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-custom text-secondary hover:bg-hover-bg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;