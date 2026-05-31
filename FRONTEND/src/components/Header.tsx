import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserAvatar } from '../hooks/useUserAvatar';
import { useNewLeadNotification } from '../hooks/useNewLeadNotification';
import { useQuery } from '@tanstack/react-query';
import api from '../services/instanceApi';
import { validateDateRange, DateRange, formatDateRange } from '../utils/dateUtils';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BarChart3,
  User,
  Settings,
  Calendar,
  AlertCircle,
  Users as UsersIcon,
  Building2,
  FileText,
  UserCheck,
  Bell,
} from 'lucide-react';

interface HeaderProps {
  onDateRangeChange?: (range: DateRange) => void;
}

export const Header: React.FC<HeaderProps> = ({ onDateRangeChange }) => {
  const { user, logout } = useAuth();
  const avatar = useUserAvatar();
  const navigate = useNavigate();
  const location = useLocation();
  const { newLeadsCount, clearNewLeads } = useNewLeadNotification();

  const { data: lembretesHoje = [] } = useQuery({
    queryKey: ['lembretes-hoje'],
    queryFn: async () => {
      const { data } = await api.get('/leads/lembretes/hoje');
      return data as { id: string; titulo: string; leadId: string; clienteName: string }[];
    },
    refetchInterval: 5 * 60 * 1000,
    enabled: !!user,
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [showMorePeriods, setShowMorePeriods] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastValidationRef = useRef<string>('');

  // Verificar se está em página que NÃO deve mostrar filtros
  const hideFiltersRoutes = ['/profile', '/settings', '/users', '/teams', '/logs', '/clients', '/leads', '/admin'];
  const shouldHideFilters = hideFiltersRoutes.includes(location.pathname);

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Função para definir período rápido (semana, mês, ano)
  const clearPresetError = () => { clearErrorTimeout(); setDateError(null); };

  const setDatePreset = (preset: 'week' | 'month' | 'year') => {
    clearPresetError();
    const end = new Date();
    const start = new Date();
    switch (preset) {
      case 'week':  start.setDate(end.getDate() - 7); break;
      case 'month': start.setMonth(end.getMonth() - 1); break;
      case 'year':  start.setDate(end.getDate() - 365); break;
    }
    const newStart = start.toISOString().split('T')[0];
    const newEnd = end.toISOString().split('T')[0];
    setStartDate(newStart);
    setEndDate(newEnd);
    setActivePreset(preset);
    if (onDateRangeChange) onDateRangeChange({ start, end });
  };

  // Novos períodos personalizados
  const setCustomRange = (days: number) => {
    clearPresetError();
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setActivePreset(`${days}d`);
    if (onDateRangeChange) onDateRangeChange({ start, end });
    setShowMorePeriods(false);
  };

  const setCurrentMonth = () => {
    clearPresetError();
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setActivePreset('current-month');
    if (onDateRangeChange) onDateRangeChange({ start, end });
    setShowMorePeriods(false);
  };

  const setLastMonth = () => {
    clearPresetError();
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setActivePreset('last-month');
    if (onDateRangeChange) onDateRangeChange({ start, end });
    setShowMorePeriods(false);
  };

  const setCurrentYear = () => {
    clearPresetError();
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setActivePreset('current-year');
    if (onDateRangeChange) onDateRangeChange({ start, end });
    setShowMorePeriods(false);
  };

  const setLastYear = () => {
    clearPresetError();
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, 0, 1);
    const end = new Date(now.getFullYear() - 1, 11, 31);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setActivePreset('last-year');
    if (onDateRangeChange) onDateRangeChange({ start, end });
    setShowMorePeriods(false);
  };

  const clearErrorTimeout = () => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = undefined;
    }
  };

  const showErrorWithDuration = (message: string) => {
    clearErrorTimeout();
    setDateError(message);
    errorTimeoutRef.current = setTimeout(() => {
      setDateError(null);
      errorTimeoutRef.current = undefined;
    }, 5000);
  };

  const handleCloseError = () => {
    clearErrorTimeout();
    setDateError(null);
  };

  const validateAndUpdateDates = (newStart: string, newEnd: string) => {
    const range: DateRange = {
      start: new Date(newStart),
      end: new Date(newEnd)
    };
    const isAdmin = user?.role === 'admin' || user?.role === 'gerente_geral';
    const validation = validateDateRange(range, isAdmin);
    const validationKey = `${newStart}-${newEnd}-${isAdmin}`;
    if (lastValidationRef.current === validationKey) return;
    lastValidationRef.current = validationKey;

    if (!validation.isValid && validation.message) {
      showErrorWithDuration(validation.message);
      if (validation.adjustedRange) {
        const adjustedStart = validation.adjustedRange.start.toISOString().split('T')[0];
        const adjustedEnd = validation.adjustedRange.end.toISOString().split('T')[0];
        if (adjustedStart !== newStart || adjustedEnd !== newEnd) {
          setStartDate(adjustedStart);
          setEndDate(adjustedEnd);
          onDateRangeChange?.(validation.adjustedRange);
        }
      }
    } else {
      clearErrorTimeout();
      setDateError(null);
      onDateRangeChange?.(range);
    }
  };

  const addOneYear = (dateStr: string) => {
    const d = new Date(dateStr);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };
  const subOneYear = (dateStr: string) => {
    const d = new Date(dateStr);
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    let newEnd = endDate;
    if (!isAdmin) {
      const cap = addOneYear(newStart);
      if (newEnd > cap) { newEnd = cap; setEndDate(newEnd); }
    }
    setStartDate(newStart);
    setActivePreset(null);
    validateAndUpdateDates(newStart, newEnd);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    let newStart = startDate;
    if (!isAdmin) {
      const cap = subOneYear(newEnd);
      if (newStart < cap) { newStart = cap; setStartDate(newStart); }
    }
    setEndDate(newEnd);
    setActivePreset(null);
    validateAndUpdateDates(newStart, newEnd);
  };

  useEffect(() => {
    return () => clearErrorTimeout();
  }, []);

  useEffect(() => {
    if (location.pathname === '/leads') clearNewLeads();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'gerente_geral';
  const isSuperAdmin = user?.role === 'admin';
  const isGerente = user?.role === 'gerente' || user?.role === 'gerente_geral';
  const currentRange = formatDateRange(new Date(startDate), new Date(endDate));

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Primeira linha – Logo, navegação, user menu */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/dashboard" className="flex items-center space-x-2 ml-2 lg:ml-0">
              <BarChart3 size={24} className="text-[var(--color-primary)]" />
              <span className="text-lg font-semibold text-slate-800">Analytics<span className="text-[var(--color-primary)]">Pro</span></span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const showBadge = item.href === '/leads' && newLeadsCount > 0;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors
                    ${isActive(item.href)
                      ? 'bg-[var(--color-primary-10)] text-[var(--color-primary)]'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {newLeadsCount > 99 ? '99+' : newLeadsCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {lembretesHoje.length > 0 && (
              <Link to={`/leads/${lembretesHoje[0].leadId}`} className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors" title={`${lembretesHoje.length} lembrete${lembretesHoje.length > 1 ? 's' : ''} para hoje`}>
                <Bell size={18} className="text-amber-500" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {lembretesHoje.length}
                </span>
              </Link>
            )}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {avatar ? (
                  <img src={avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.nome?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-700">{user?.nome}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-slate-200">
                  <Link to="/profile" className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2" onClick={() => setUserMenuOpen(false)}>
                    <User size={16} /><span>Meu Perfil</span>
                  </Link>
                  <Link to="/clients" className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2" onClick={() => setUserMenuOpen(false)}>
                    <UserCheck size={16} /><span>Clientes</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/settings" className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2" onClick={() => setUserMenuOpen(false)}>
                      <Settings size={16} /><span>Configurações</span>
                    </Link>
                  )}
                  {isSuperAdmin && (
                    <Link to="/users" className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2" onClick={() => setUserMenuOpen(false)}>
                      <UsersIcon size={16} /><span>Usuários</span>
                    </Link>
                  )}
                  {(isSuperAdmin || isGerente) && (
                    <Link to="/teams" className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2" onClick={() => setUserMenuOpen(false)}>
                      <Building2 size={16} /><span>Equipes</span>
                    </Link>
                  )}
                  {isSuperAdmin && (
                    <Link to="/logs" className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2" onClick={() => setUserMenuOpen(false)}>
                      <FileText size={16} /><span>Logs</span>
                    </Link>
                  )}
                  <div className="border-t border-slate-200 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center space-x-2">
                    <LogOut size={16} /><span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Segunda linha – Filtros (visíveis apenas fora das rotas administrativas) */}
        {!shouldHideFilters && (
          <div className="hidden lg:block py-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              {/* Botões rápidos existentes */}
              {(['week', 'month', 'year'] as const).map((preset) => {
                const labels = { week: 'Semana', month: 'Mês', year: 'Ano' };
                const active = activePreset === preset;
                return (
                  <button
                    key={preset}
                    onClick={() => setDatePreset(preset)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={active
                      ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                      : { backgroundColor: '#f8fafc', color: '#475569' }
                    }
                  >
                    {labels[preset]}
                  </button>
                );
              })}

              {/* Dropdown com mais períodos */}
              {(() => {
                const customPresetLabels: Record<string, string> = {
                  '7d': 'Últimos 7 dias',
                  '15d': 'Últimos 15 dias',
                  '30d': 'Últimos 30 dias',
                  '90d': 'Últimos 90 dias',
                  'current-month': 'Este mês',
                  'last-month': 'Mês passado',
                  'current-year': 'Este ano',
                  'last-year': 'Ano passado',
                };
                const isCustomActive = activePreset !== null && activePreset in customPresetLabels;
                const buttonLabel = isCustomActive ? customPresetLabels[activePreset!] : 'Mais períodos';
                return (
                  <div className="relative">
                    <button
                      onClick={() => setShowMorePeriods(!showMorePeriods)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors"
                      style={isCustomActive
                        ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                        : { backgroundColor: '#f8fafc', color: '#475569' }
                      }
                    >
                      {buttonLabel} <ChevronDown size={14} className={`transition-transform ${showMorePeriods ? 'rotate-180' : ''}`} />
                    </button>
                    {showMorePeriods && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20 py-1">
                        {[
                          { label: 'Últimos 7 dias', action: () => setCustomRange(7), key: '7d' },
                          { label: 'Últimos 15 dias', action: () => setCustomRange(15), key: '15d' },
                          { label: 'Últimos 30 dias', action: () => setCustomRange(30), key: '30d' },
                          { label: 'Últimos 90 dias', action: () => setCustomRange(90), key: '90d' },
                        ].map(({ label, action, key }) => (
                          <button
                            key={key}
                            onClick={action}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              activePreset === key
                                ? 'bg-[var(--color-primary-10)] text-[var(--color-primary)] font-medium'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                        <div className="border-t border-slate-100 my-1"></div>
                        {[
                          { label: 'Este mês', action: setCurrentMonth, key: 'current-month' },
                          { label: 'Mês passado', action: setLastMonth, key: 'last-month' },
                          { label: 'Este ano', action: setCurrentYear, key: 'current-year' },
                          ...(isAdmin ? [{ label: 'Ano passado', action: setLastYear, key: 'last-year' }] : []),
                        ].map(({ label, action, key }) => (
                          <button
                            key={key}
                            onClick={action}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              activePreset === key
                                ? 'bg-[var(--color-primary-10)] text-[var(--color-primary)] font-medium'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Seletor de data customizado */}
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg ml-auto">
                <Calendar size={18} className="text-slate-400" />
                <input type="date" value={startDate} onChange={handleStartDateChange} className="bg-transparent border-none focus:ring-0 text-slate-600 w-28" max={endDate} min={!isAdmin ? subOneYear(endDate) : undefined} />
                <span className="text-slate-400">até</span>
                <input type="date" value={endDate} onChange={handleEndDateChange} className="bg-transparent border-none focus:ring-0 text-slate-600 w-28" min={startDate} max={!isAdmin ? addOneYear(startDate) : undefined} />
              </div>

            </div>

            {/* Mensagem de erro de período */}
            {dateError && (
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center justify-between">
                <span className="text-sm text-amber-700">{dateError}</span>
                <button onClick={handleCloseError}><X size={16} className="text-amber-500" /></button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Filters Toggle */}
        {!shouldHideFilters && (
          <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-100">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center space-x-1 text-sm text-slate-600"
            >
              <Calendar size={16} />
              <span>Filtros</span>
              <ChevronDown size={16} className={`transform transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
            </button>
            <span className="text-xs text-slate-500">{currentRange}</span>
          </div>
        )}

        {/* Mobile Filters */}
        {!shouldHideFilters && filtersOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">Período</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={startDate} onChange={handleStartDateChange} className="border border-slate-200 rounded-lg px-4 py-2 w-full" max={endDate} />
                <input type="date" value={endDate} onChange={handleEndDateChange} className="border border-slate-200 rounded-lg px-4 py-2 w-full" min={startDate} />
              </div>
              <div className="flex space-x-2 mt-2">
                {(['week', 'month', 'year'] as const).map((preset) => {
                  const labels = { week: 'Semana', month: 'Mês', year: 'Ano' };
                  return (
                    <button
                      key={preset}
                      onClick={() => setDatePreset(preset)}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={activePreset === preset
                        ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                        : { backgroundColor: '#e2e8f0', color: '#475569' }
                      }
                    >
                      {labels[preset]}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCustomRange(30)}
                className="w-full text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={activePreset === '30d'
                  ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                  : { backgroundColor: '#e2e8f0', color: '#475569' }
                }
              >
                Últimos 30 dias
              </button>
              <button
                onClick={setCurrentMonth}
                className="w-full text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={activePreset === 'current-month'
                  ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                  : { backgroundColor: '#e2e8f0', color: '#475569' }
                }
              >
                Este mês
              </button>
              <button
                onClick={setCurrentYear}
                className="w-full text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={activePreset === 'current-year'
                  ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                  : { backgroundColor: '#e2e8f0', color: '#475569' }
                }
              >
                Este ano
              </button>
            </div>
          </div>
        )}

        {/* Terceira linha: Mensagens de erro/info (apenas desktop, mobile já incluído acima) */}
        {!shouldHideFilters && (
          <div className="hidden lg:block py-2">
            {dateError && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle size={18} className="text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-700">{dateError}</p>
                    <p className="text-xs text-amber-600 mt-1">Período ajustado automaticamente para 1 ano.</p>
                  </div>
                  <button onClick={handleCloseError} className="text-amber-500 hover:text-amber-700"><X size={16} /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Navigation - Menu Hamburguer */}
      {mobileMenuOpen && (
        <div className="lg:hidden py-4 border-t border-slate-200">
          <nav className="flex flex-col space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-3
                    ${isActive(item.href)
                      ? 'bg-[var(--color-primary-10)] text-[var(--color-primary)]'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-3 text-slate-600 hover:bg-slate-100"
            >
              <User size={18} />
              <span>Meu Perfil</span>
            </Link>
            <Link
              to="/clients"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-3 text-slate-600 hover:bg-slate-100"
            >
              <UserCheck size={18} />
              <span>Clientes</span>
            </Link>
            {isAdmin && (
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-3 text-slate-600 hover:bg-slate-100"
              >
                <Settings size={18} />
                <span>Configurações</span>
              </Link>
            )}
            {isSuperAdmin && (
              <Link
                to="/users"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-3 text-slate-600 hover:bg-slate-100"
              >
                <UsersIcon size={18} />
                <span>Usuários</span>
              </Link>
            )}
            {(isSuperAdmin || isGerente) && (
              <Link
                to="/teams"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-3 text-slate-600 hover:bg-slate-100"
              >
                <Building2 size={18} />
                <span>Equipes</span>
              </Link>
            )}
            {isSuperAdmin && (
              <Link
                to="/logs"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-3 text-slate-600 hover:bg-slate-100"
              >
                <FileText size={18} />
                <span>Logs</span>
              </Link>
            )}
          </nav>
        </div>
      )}

      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        .animate-shrink {
          animation: shrink 5s linear forwards;
        }
      `}</style>
    </header>
  );
};
