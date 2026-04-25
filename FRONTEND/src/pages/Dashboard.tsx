import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import KpiCard from '../components/KpiCard';
import InteractiveLineChart from '../components/charts/InteractiveLineChart';
import InteractiveBarChart from '../components/charts/InteractiveBarChart';
import InteractivePieChart from '../components/charts/InteractivePieChart';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target,
  Phone,
  AlertCircle,
  Loader2,
  Clock,
  User,
  Users as UsersIcon
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  });
  const [store, setStore] = useState<string>('all');
  const [team, setTeam] = useState<string>('all');
  
  const { data: metrics, isLoading, error, refetch } = useDashboardMetrics({
    dateRange,
    store,
    team,
  });
  
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const role = user?.role;
  const isAtendente = role === 'atendente';
  const isGerente = role === 'gerente';
  const isAdminOuGerenteGeral = role === 'admin' || role === 'gerente_geral';

  const firstName = user?.name?.split(' ')[0] ?? '';
  const greeting = (() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Bom dia';
    if (h >= 12 && h < 18) return 'Boa tarde';
    return 'Boa noite';
  })();

  const handleDateRangeChange = (range: { start: Date; end: Date }) => setDateRange(range);
  const handleStoreChange = (newStore: string) => setStore(newStore);
  const handleTeamChange = (newTeam: string) => setTeam(newTeam);

  const safeArray = (arr: any[] | undefined) => (Array.isArray(arr) ? arr : []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          onDateRangeChange={handleDateRangeChange}
          onStoreChange={handleStoreChange}
          onTeamChange={handleTeamChange}
        />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-slate-600">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          onDateRangeChange={handleDateRangeChange}
          onStoreChange={handleStoreChange}
          onTeamChange={handleTeamChange}
        />
        <div className="max-w-full px-6 md:px-8 py-8">
          <div className="bg-rose-50 p-8 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-600">Erro ao carregar dados do dashboard</p>
            <button 
              onClick={() => refetch()} 
              className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ATENDENTE ====================
  if (isAtendente) {
    const bySource = safeArray(metrics.bySource);
    const byStatus = safeArray(metrics.byStatus);
    const byImportance = safeArray(metrics.byImportance);
    const byStore = safeArray(metrics.byStore);
    const evolution = safeArray(metrics.evolution);

    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          onDateRangeChange={handleDateRangeChange}
          onStoreChange={handleStoreChange}
          onTeamChange={handleTeamChange}
        />
        <main className="max-w-full px-6 md:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-800">Meu Painel</h1>
            <p className="text-base text-slate-500 mt-1">{greeting}, {firstName}.</p>
            <p className="text-sm text-slate-400 mt-1">Acompanhe sua performance individual</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <KpiCard title="Meus Leads" value={metrics.kpis.totalLeads} icon={User} change={12} />
            <KpiCard title="Minhas Conversões" value={metrics.kpis.convertedLeads} icon={Target} change={8} />
            <KpiCard title="Taxa Pessoal" value={`${metrics.kpis.conversionRate}%`} icon={TrendingUp} change={2.5} />
            <KpiCard title="Minha Receita" value={`R$ ${metrics.kpis.totalRevenue.toLocaleString()}`} icon={DollarSign} change={8.3} />
          </div>

          {(selectedPeriod || selectedSource) && (
            <div className="mb-4 flex items-center space-x-2">
              <span className="text-xs text-slate-500">Filtros ativos:</span>
              {selectedPeriod && (
                <button onClick={() => setSelectedPeriod(null)} className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs">
                  Período: {selectedPeriod} <span className="ml-1">×</span>
                </button>
              )}
              {selectedSource && (
                <button onClick={() => setSelectedSource(null)} className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs">
                  Origem: {selectedSource} <span className="ml-1">×</span>
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Minha Evolução</h3>
              <InteractiveLineChart data={evolution} />
            </div>
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Meus Leads por Origem</h3>
              <InteractiveBarChart 
                data={bySource.map(item => ({ name: item.source, value: item.count }))}
                onBarClick={(point) => setSelectedSource(point.name)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Meus Leads por Status</h3>
              <InteractiveBarChart data={byStatus.map(item => ({ name: item.status, value: item.count }))} />
            </div>
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Minha Importância</h3>
              <InteractivePieChart data={byImportance.map(item => ({ name: item.importance, value: item.count }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Meus Leads por Loja</h3>
              <InteractiveBarChart data={byStore.map(item => ({ name: item.store, value: item.count }))} />
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-400 text-center">
            <p>💡 Dica: Clique nos gráficos para filtrar dados</p>
          </div>
        </main>
      </div>
    );
  }

  // ==================== GERENTE ====================
  if (isGerente) {
    const bySource = safeArray(metrics.bySource);
    const byStatus = safeArray(metrics.byStatus);
    const byImportance = safeArray(metrics.byImportance);
    const evolution = safeArray(metrics.evolution);
    const performance = safeArray(metrics.performance);
    const lossReasons = safeArray(metrics.lossReasons);

    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          onDateRangeChange={handleDateRangeChange}
          onStoreChange={handleStoreChange}
          onTeamChange={handleTeamChange}
        />
        <main className="max-w-full px-6 md:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-800">Painel da Equipe</h1>
            <p className="text-base text-slate-500 mt-1">{greeting}, {firstName}.</p>
            <p className="text-sm text-slate-400 mt-1">Acompanhe a performance da sua equipe</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <KpiCard title="Leads da Equipe" value={metrics.kpis.totalLeads} icon={UsersIcon} change={12} />
            <KpiCard title="Conversões da Equipe" value={metrics.kpis.convertedLeads} icon={Target} change={8} />
            <KpiCard title="Taxa da Equipe" value={`${metrics.kpis.conversionRate}%`} icon={TrendingUp} change={2.5} />
            <KpiCard title="Receita da Equipe" value={`R$ ${metrics.kpis.totalRevenue.toLocaleString()}`} icon={DollarSign} change={8.3} />
          </div>

          {(selectedPeriod || selectedSource || selectedAgent) && (
            <div className="mb-4 flex items-center space-x-2 flex-wrap gap-2">
              <span className="text-xs text-slate-500">Filtros ativos:</span>
              {selectedPeriod && (
                <button onClick={() => setSelectedPeriod(null)} className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs">
                  Período: {selectedPeriod} <span className="ml-1">×</span>
                </button>
              )}
              {selectedSource && (
                <button onClick={() => setSelectedSource(null)} className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs">
                  Origem: {selectedSource} <span className="ml-1">×</span>
                </button>
              )}
              {selectedAgent && (
                <button onClick={() => setSelectedAgent(null)} className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs">
                  Atendente: {selectedAgent} <span className="ml-1">×</span>
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Evolução da Equipe</h3>
              <InteractiveLineChart data={evolution} />
            </div>
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Leads por Origem</h3>
              <InteractiveBarChart 
                data={bySource.map(item => ({ name: item.source, value: item.count }))}
                onBarClick={(point) => setSelectedSource(point.name)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Leads por Status</h3>
              <InteractiveBarChart data={byStatus.map(item => ({ name: item.status, value: item.count }))} />
            </div>
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Distribuição por Importância</h3>
              <InteractivePieChart data={byImportance.map(item => ({ name: item.importance, value: item.count }))} />
            </div>
          </div>

          <div className="card p-7 mb-8">
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
              <Phone className="mr-2 h-5 w-5 text-slate-400" />
              Taxa de Conversão por Atendente
            </h3>
            <div className="space-y-4">
              {performance.map((agent) => (
                <div
                  key={agent.agent}
                  className={`group p-2 rounded-lg transition-colors cursor-pointer ${selectedAgent === agent.agent ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                  onClick={() => setSelectedAgent(selectedAgent === agent.agent ? null : agent.agent)}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-700 w-24">{agent.agent}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${(agent.conversions / agent.leads) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{((agent.conversions / agent.leads) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-end space-x-4 mt-1 text-xs text-slate-500">
                    <span>{agent.leads} leads</span>
                    <span>{agent.conversions} conversões</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-slate-400" />
              Motivos de Finalização
            </h3>
            <div className="space-y-4">
              {lossReasons.map((reason) => (
                <div key={reason.reason} className="flex items-center">
                  <span className="text-sm text-slate-600 w-24">{reason.reason}</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(reason.count / lossReasons.reduce((acc, r) => acc + r.count, 0)) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-slate-600">{reason.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-400 text-center">
            <p>💡 Dica: Clique nos atendentes para filtrar dados • Clique nos gráficos para explorar</p>
          </div>
        </main>
      </div>
    );
  }

  // ==================== ADMIN OU GERENTE GERAL ====================
  if (isAdminOuGerenteGeral) {
    const funnel = safeArray(metrics.funnel);
    const evolution = safeArray(metrics.evolution);
    const bySource = safeArray(metrics.bySource);
    const byStatus = safeArray(metrics.byStatus);
    const byImportance = safeArray(metrics.byImportance);
    const byStore = safeArray(metrics.byStore);
    const convertedVsNonConverted = safeArray(metrics.convertedVsNonConverted);
    const byTeam = safeArray(metrics.byTeam);
    const performance = safeArray(metrics.performance);
    const lossReasons = safeArray(metrics.lossReasons);
    const avgTime = metrics.avgTimeToFirstContact || '0 dias';

    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          onDateRangeChange={handleDateRangeChange}
          onStoreChange={handleStoreChange}
          onTeamChange={handleTeamChange}
        />
        <main className="max-w-full px-6 md:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-800">
              {role === 'admin' ? 'Painel Executivo' : 'Painel Gerencial'}
            </h1>
            <p className="text-base text-slate-500 mt-1">{greeting}, {firstName}.</p>
            <p className="text-sm text-slate-400 mt-1">
              {role === 'admin' ? 'Visão geral completa da operação' : 'Visão consolidada de todas as equipes'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <KpiCard title="Total de Leads" value={metrics.kpis.totalLeads} icon={Users} change={12} />
            <KpiCard title="Taxa de Conversão" value={`${metrics.kpis.conversionRate}%`} icon={Target} change={2.5} />
            <KpiCard title="Ticket Médio" value={`R$ ${metrics.kpis.avgDealValue.toLocaleString()}`} icon={DollarSign} change={-1.2} />
            <KpiCard title="Receita Total" value={`R$ ${metrics.kpis.totalRevenue.toLocaleString()}`} icon={TrendingUp} change={8.3} />
          </div>

          {(selectedPeriod || selectedSource) && (
            <div className="mb-4 flex items-center space-x-2">
              <span className="text-xs text-slate-500">Filtros ativos:</span>
              {selectedPeriod && (
                <button onClick={() => setSelectedPeriod(null)} className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs">
                  Período: {selectedPeriod} <span className="ml-1">×</span>
                </button>
              )}
              {selectedSource && (
                <button onClick={() => setSelectedSource(null)} className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs">
                  Origem: {selectedSource} <span className="ml-1">×</span>
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Funil de Vendas</h3>
              <InteractivePieChart data={funnel.map(item => ({ name: item.stage, value: item.count }))} />
            </div>
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Evolução de Leads</h3>
              <InteractiveLineChart data={evolution} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Por Origem</h3>
              <InteractiveBarChart 
                data={bySource.map(item => ({ name: item.source, value: item.count }))}
                onBarClick={(point) => setSelectedSource(point.name)}
              />
            </div>
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Por Status</h3>
              <InteractiveBarChart data={byStatus.map(item => ({ name: item.status, value: item.count }))} />
            </div>
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Importância</h3>
              <InteractiveBarChart data={byImportance.map(item => ({ name: item.importance, value: item.count }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Leads por Loja</h3>
              <InteractiveBarChart data={byStore.map(item => ({ name: item.store, value: item.count }))} />
            </div>
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Convertidos vs Não Convertidos</h3>
              <InteractivePieChart data={convertedVsNonConverted} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-7">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Leads por Equipe</h3>
              <InteractiveBarChart data={byTeam.map(item => ({ name: item.team, value: item.count }))} />
            </div>
            <div className="card p-7 flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-slate-700">Tempo médio até atendimento</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{avgTime}</p>
              </div>
              <Clock size={36} className="text-slate-400" />
            </div>
          </div>

          <div className="card p-7 mb-8">
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
              <Phone className="mr-2 h-5 w-5 text-slate-400" />
              Performance dos Atendentes
            </h3>
            <div className="space-y-4">
              {performance.map((agent) => (
                <div key={agent.agent} className="flex items-center">
                  <span className="text-sm text-slate-600 w-20">{agent.agent}</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${(agent.conversions / agent.leads) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-slate-600">{agent.conversions}/{agent.leads}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-slate-400" />
              Motivos de Perda
            </h3>
            <div className="space-y-4">
              {lossReasons.map((reason) => (
                <div key={reason.reason} className="flex items-center">
                  <span className="text-sm text-slate-600 w-24">{reason.reason}</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(reason.count / lossReasons.reduce((acc, r) => acc + r.count, 0)) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-slate-600">{reason.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-400 text-center">
            <p>💡 Dica: Clique nos gráficos para filtrar dados • Use o brush para dar zoom • Clique na legenda para ocultar séries</p>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default Dashboard;