import React, { useState } from 'react';
import Header from '../components/Header';
import { useLogs } from '../hooks/useLogs';
import { DateRange } from '../utils/dateUtils';
import {
  FileText, Search, X, ChevronLeft, ChevronRight,
  Loader2, LogIn, Plus, Pencil, Trash2, LogOut, ChevronDown, ChevronUp, Monitor,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const actionConfig: Record<string, { label: string; classes: string; Icon: React.FC<{ size?: number }> }> = {
  login:  { label: 'Login',    classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',    Icon: ({ size }) => <LogIn    size={size} /> },
  logout: { label: 'Logout',   classes: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200', Icon: ({ size }) => <LogOut   size={size} /> },
  create: { label: 'Criação',  classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', Icon: ({ size }) => <Plus size={size} /> },
  update: { label: 'Edição',   classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',  Icon: ({ size }) => <Pencil   size={size} /> },
  delete: { label: 'Exclusão', classes: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',     Icon: ({ size }) => <Trash2   size={size} /> },
};

const entityLabels: Record<string, string> = {
  user: 'Usuário', team: 'Equipe', lead: 'Lead',
  negotiation: 'Negociação', client: 'Cliente',
};

const Logs = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage]               = useState(1);
  const [search, setSearch]         = useState('');
  const [actionFilter, setAction]   = useState('');
  const [entityFilter, setEntity]   = useState('');
  const [dateRange, setDateRange]   = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  });
  const limit = 20;

  const { data, isLoading } = useLogs({
    page, limit, search, action: actionFilter || undefined,
    entityType: entityFilter || undefined, dateRange,
  });

  const logs       = data?.data       ?? [];
  const total      = data?.total      ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const startItem  = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem    = Math.min(page * limit, total);

  const hasFilters = !!(search || actionFilter || entityFilter);

  const clearFilters = () => {
    setSearch(''); setAction(''); setEntity(''); setPage(1);
  };

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleAction = (val: string) => { setAction(val); setPage(1); };
  const handleEntity = (val: string) => { setEntity(val); setPage(1); };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onDateRangeChange={range => { setDateRange(range); setPage(1); }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Cabeçalho ── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">Logs do Sistema</h1>
            <p className="text-sm text-slate-500 mt-1">Registro completo de acessos e operações</p>
          </div>
          {!isLoading && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
              <FileText size={16} className="text-[var(--color-primary)]" />
              <span className="text-sm font-semibold text-slate-800">{total}</span>
              <span className="text-sm text-slate-500">registros</span>
            </div>
          )}
        </div>

        {/* ── Filtros ── */}
        <div className="card p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text" placeholder="Buscar por usuário, entidade ou detalhe..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="input w-full pl-9"
              />
            </div>
            <select value={actionFilter} onChange={e => handleAction(e.target.value)} className="input sm:w-40 text-sm">
              <option value="">Todas ações</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="create">Criação</option>
              <option value="update">Edição</option>
              <option value="delete">Exclusão</option>
            </select>
            <select value={entityFilter} onChange={e => handleEntity(e.target.value)} className="input sm:w-40 text-sm">
              <option value="">Todas entidades</option>
              <option value="user">Usuário</option>
              <option value="team">Equipe</option>
              <option value="lead">Lead</option>
              <option value="negotiation">Negociação</option>
              <option value="client">Cliente</option>
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-secondary px-3" title="Limpar filtros">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* ── Tabela ── */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Data / Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ação</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Entidade</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)] mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Carregando logs...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <FileText size={32} className="mb-2 opacity-40" />
                        <p className="text-sm font-medium">Nenhum log encontrado</p>
                        {hasFilters && (
                          <button onClick={clearFilters} className="mt-2 text-xs text-[var(--color-primary)] hover:underline">
                            Limpar filtros
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map(log => {
                    const action     = actionConfig[log.action];
                    const ActionIcon = action?.Icon;
                    const expanded   = expandedRow === log.id;
                    return (
                      <React.Fragment key={log.id}>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm font-medium text-slate-700">
                              {format(new Date(log.createdAt), 'dd MMM yyyy', { locale: ptBR })}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {format(new Date(log.createdAt), 'HH:mm:ss')}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-700">{log.userName}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{log.userEmail}</p>
                          </td>
                          <td className="px-6 py-4">
                            {action && (
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${action.classes}`}>
                                <ActionIcon size={11} />{action.label}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              {entityLabels[log.entityType] ?? log.entityType}
                            </p>
                            {log.entityName && <p className="text-sm text-slate-700 mt-0.5">{log.entityName}</p>}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                            <p className="truncate">{log.details}</p>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => setExpandedRow(expanded ? null : log.id)}
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                              title="Detalhes técnicos"
                            >
                              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                          </td>
                        </tr>
                        {expanded && (
                          <tr className="bg-slate-50">
                            <td colSpan={6} className="px-6 py-3 border-t border-slate-100">
                              <div className="flex flex-wrap gap-6 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                  <span className="font-semibold text-slate-600">IP:</span>
                                  <code className="bg-slate-100 px-2 py-0.5 rounded">{log.ipAddress}</code>
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Monitor size={13} />
                                  <span className="font-semibold text-slate-600">Agente:</span>
                                  <span>{log.userAgent}</span>
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Paginação ── */}
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
            <p className="text-sm text-slate-500">
              {total === 0 ? 'Nenhum resultado' : `Mostrando ${startItem}–${endItem} de ${total} registros`}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => p - 1)} disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '...')[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === '...' ? (
                      <span key={`e-${idx}`} className="px-2 text-slate-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                          ${page === p
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Logs;
