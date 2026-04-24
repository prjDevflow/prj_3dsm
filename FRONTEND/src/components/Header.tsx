import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Info,
  Users as UsersIcon,
  Building2,
  FileText
} from 'lucide-react';

interface HeaderProps {
  onDateRangeChange?: (range: DateRange) => void;
  onStoreChange?: (store: string) => void;
  onTeamChange?: (team: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onDateRangeChange, 
  onStoreChange, 
  onTeamChange 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [showMorePeriods, setShowMorePeriods] = useState(false);
  
  const errorTimeoutRef = useRef<NodeJS.Timeout>();
  const lastValidationRef = useRef<string>('');

  // Verificar se está em página que NÃO deve mostrar filtros
  const hideFiltersRoutes = ['/profile', '/settings', '/users', '/teams', '/logs'];
  const shouldHideFilters = hideFiltersRoutes.includes(location.pathname);

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  const [store, setStore] = useState('all');
  const [team, setTeam] = useState('all');

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Função para definir período rápido (semana, mês, ano)
  const setDatePreset = (preset: 'week' | 'month' | 'year') => {
    const end = new Date();
    const start = new Date();
    switch (preset) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }
    const newStart = start.toISOString().split('T')[0];
    const newEnd = end.toISOString().split('T')[0];
    setStartDate(newStart);
    setEndDate(newEnd);
    if (onDateRangeChange) onDateRangeChange({ start, end });
  };

  // Novos períodos personalizados
  const setCustomRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    if (onDateRangeChange) onDateRangeChange({ start, end });
    setShowMorePeriods(false);
  };

  const setCurrentMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    if (onDateRangeChange) onDateRangeChange({ start, end });
    setShowMorePeriods(false);
  };

  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    if (onDateRangeChange) onDateRangeChange({ start, end });
    setShowMorePeriods(false);
  };

  const setCurrentYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    if (onDateRangeChange) onDateRangeChange({ start, end });
    setShowMorePeriods(false);
  };

  const setLastYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, 0, 1);
    const end = new Date(now.getFullYear() - 1, 11, 31);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    validateAndUpdateDates(newStart, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setEndDate(newEnd);
    validateAndUpdateDates(startDate, newEnd);
  };

  useEffect(() => {
    return () => clearErrorTimeout();
  }, []);

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStore(e.target.value);
    onStoreChange?.(e.target.value);
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTeam(e.target.value);
    onTeamChange?.(e.target.value);
  };

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
              <BarChart3 size={24} className="text-[#0F3B5E]" />
              <span className="text-lg font-semibold text-slate-800">Analytics<span className="text-[#0F3B5E]">Pro</span></span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors
                    ${isActive(item.href)
                      ? 'bg-[#0F3B5E]/10 text-[#0F3B5E]'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-[#0F3B5E] rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-slate-200">
                  <Link to="/profile" className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2" onClick={() => setUserMenuOpen(false)}>
                    <User size={16} /><span>Meu Perfil</span>
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
              <button onClick={() => setDatePreset('week')} className="text-xs px-3 py-1.5 bg-slate-50 rounded-lg hover:bg-slate-100">Semana</button>
              <button onClick={() => setDatePreset('month')} className="text-xs px-3 py-1.5 bg-slate-50 rounded-lg hover:bg-slate-100">Mês</button>
              <button onClick={() => setDatePreset('year')} className="text-xs px-3 py-1.5 bg-slate-50 rounded-lg hover:bg-slate-100">Ano</button>

              {/* Dropdown com mais períodos */}
              <div className="relative">
                <button
                  onClick={() => setShowMorePeriods(!showMorePeriods)}
                  className="text-xs px-3 py-1.5 bg-slate-50 rounded-lg hover:bg-slate-100 flex items-center gap-1"
                >
                  Mais períodos <ChevronDown size={14} className={`transition-transform ${showMorePeriods ? 'rotate-180' : ''}`} />
                </button>
                {showMorePeriods && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20 py-1">
                    <button onClick={() => setCustomRange(7)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Últimos 7 dias</button>
                    <button onClick={() => setCustomRange(15)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Últimos 15 dias</button>
                    <button onClick={() => setCustomRange(30)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Últimos 30 dias</button>
                    <button onClick={() => setCustomRange(90)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Últimos 90 dias</button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button onClick={setCurrentMonth} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Este mês</button>
                    <button onClick={setLastMonth} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Mês passado</button>
                    <button onClick={setCurrentYear} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Este ano</button>
                    <button onClick={setLastYear} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Ano passado</button>
                  </div>
                )}
              </div>

              {/* Seletor de data customizado */}
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg ml-auto">
                <Calendar size={18} className="text-slate-400" />
                <input type="date" value={startDate} onChange={handleStartDateChange} className="bg-transparent border-none focus:ring-0 text-slate-600 w-28" max={endDate} />
                <span className="text-slate-400">até</span>
                <input type="date" value={endDate} onChange={handleEndDateChange} className="bg-transparent border-none focus:ring-0 text-slate-600 w-28" min={startDate} />
              </div>

              {/* Filtros de loja e time */}
              <select value={store} onChange={handleStoreChange} className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-sm text-slate-600">
                <option value="all">Todas as lojas</option>
                <option value="loja1">Loja Centro</option>
                <option value="loja2">Loja Norte</option>
                <option value="loja3">Loja Sul</option>
              </select>
              <select value={team} onChange={handleTeamChange} className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-sm text-slate-600">
                <option value="all">Todos os times</option>
                <option value="vendas">Vendas</option>
                <option value="suporte">Suporte</option>
                <option value="qualificacao">Qualificação</option>
              </select>
            </div>

            {/* Mensagem de erro de período */}
            {dateError && (
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center justify-between">
                <span className="text-sm text-amber-700">{dateError}</span>
                <button onClick={handleCloseError}><X size={16} className="text-amber-500" /></button>
              </div>
            )}
            {!isAdmin && !dateError && (
              <div className="mt-1 text-right text-xs text-slate-400">Período máximo: 1 ano</div>
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
                <button onClick={() => setDatePreset('week')} className="flex-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg">Semana</button>
                <button onClick={() => setDatePreset('month')} className="flex-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg">Mês</button>
                <button onClick={() => setDatePreset('year')} className="flex-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg">Ano</button>
              </div>
              <button onClick={() => setCustomRange(30)} className="w-full text-xs px-3 py-1.5 bg-slate-100 rounded-lg">Últimos 30 dias</button>
              <button onClick={setCurrentMonth} className="w-full text-xs px-3 py-1.5 bg-slate-100 rounded-lg">Este mês</button>
              <button onClick={setCurrentYear} className="w-full text-xs px-3 py-1.5 bg-slate-100 rounded-lg">Este ano</button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Loja</label>
              <select value={store} onChange={handleStoreChange} className="border border-slate-200 rounded-lg px-4 py-2 w-full">
                <option value="all">Todas as lojas</option>
                <option value="loja1">Loja Centro</option>
                <option value="loja2">Loja Norte</option>
                <option value="loja3">Loja Sul</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Time</label>
              <select value={team} onChange={handleTeamChange} className="border border-slate-200 rounded-lg px-4 py-2 w-full">
                <option value="all">Todos os times</option>
                <option value="vendas">Vendas</option>
                <option value="suporte">Suporte</option>
                <option value="qualificacao">Qualificação</option>
              </select>
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
            {!isAdmin && !dateError && (
              <div className="flex items-center justify-end text-xs text-slate-400">
                <Info size={12} className="mr-1" /> Período máximo: 1 ano
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
                      ? 'bg-[#0F3B5E]/10 text-[#0F3B5E]'
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

export default Header;