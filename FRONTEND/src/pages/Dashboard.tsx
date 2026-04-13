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
  Filter
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: metrics, isLoading, error } = useDashboardMetrics();
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0F3B5E] mx-auto mb-4" />
            <p className="text-slate-600">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-rose-50 p-8 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-600">Erro ao carregar dados do dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar dados baseado nas interações
  const filteredEvolution = selectedPeriod
    ? metrics.evolution.filter(d => d.date === selectedPeriod)
    : metrics.evolution;

  const filteredBySource = selectedSource
    ? metrics.bySource.filter(s => s.source === selectedSource)
    : metrics.bySource;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Bem-vindo de volta, {user?.name}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Total de Leads"
            value={metrics.kpis.totalLeads}
            icon={Users}
            change={12}
          />
          <KpiCard
            title="Taxa de Conversão"
            value={`${metrics.kpis.conversionRate}%`}
            icon={Target}
            change={2.5}
          />
          <KpiCard
            title="Ticket Médio"
            value={`R$ ${metrics.kpis.avgDealValue.toLocaleString()}`}
            icon={DollarSign}
            change={-1.2}
          />
          <KpiCard
            title="Receita Total"
            value={`R$ ${metrics.kpis.totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            change={8.3}
          />
        </div>

        {/* Filtros ativos */}
        {(selectedPeriod || selectedSource) && (
          <div className="mb-4 flex items-center space-x-2">
            <span className="text-xs text-slate-500">Filtros ativos:</span>
            {selectedPeriod && (
              <button
                onClick={() => setSelectedPeriod(null)}
                className="inline-flex items-center px-2 py-1 bg-[#0F3B5E]/10 text-[#0F3B5E] rounded-md text-xs"
              >
                Período: {selectedPeriod}
                <span className="ml-1">×</span>
              </button>
            )}
            {selectedSource && (
              <button
                onClick={() => setSelectedSource(null)}
                className="inline-flex items-center px-2 py-1 bg-[#0F3B5E]/10 text-[#0F3B5E] rounded-md text-xs"
              >
                Origem: {selectedSource}
                <span className="ml-1">×</span>
              </button>
            )}
          </div>
        )}

        {/* Gráfico Interativo de Linha */}
        <div className="card p-6 mb-8">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            Evolução de Leads (clique nos pontos para detalhar)
          </h3>
          <InteractiveLineChart
            data={metrics.evolution}
            onPointClick={(point) => setSelectedPeriod(point.date)}
            onBrushChange={(start, end) => {
              console.log('Zoom aplicado:', start, end);
            }}
          />
        </div>

        {/* Gráficos Interativos de Barra */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              Leads por Origem (clique nas barras)
            </h3>
            <InteractiveBarChart
              data={metrics.bySource.map(item => ({
                name: item.source,
                value: item.count,
                color: '#0F3B5E'
              }))}
              onBarClick={(point) => setSelectedSource(point.name)}
            />
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              Leads por Status
            </h3>
            <InteractiveBarChart
              data={metrics.byStatus.map(item => ({
                name: item.status,
                value: item.count,
                color: item.status === 'ganho' ? '#10B981' : 
                       item.status === 'perdido' ? '#EF4444' : '#0F3B5E'
              }))}
            />
          </div>
        </div>

        {/* Gráfico de Pizza Interativo */}
        <div className="card p-6 mb-8">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            Distribuição por Importância
          </h3>
          <InteractivePieChart
            data={metrics.byImportance.map(item => ({
              name: item.importance,
              value: item.count,
              color: item.importance === 'alta' ? '#EF4444' :
                     item.importance === 'media' ? '#F59E0B' : '#10B981'
            }))}
            onSliceClick={(point) => console.log('Slice clicado:', point)}
          />
        </div>

        {/* Performance e Motivos de Perda */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center">
              <Phone className="mr-2 h-4 w-4 text-slate-400" />
              Performance dos Atendentes
            </h3>
            <div className="space-y-4">
              {metrics.performance.map((agent) => (
                <div
                  key={agent.agent}
                  className="group hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => console.log('Atendente selecionado:', agent.agent)}
                >
                  <div className="flex items-center">
                    <span className="text-sm text-slate-600 w-20">{agent.agent}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0F3B5E] rounded-full group-hover:bg-[#1E5A7A] transition-colors"
                          style={{ width: `${(agent.conversions / agent.leads) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-slate-600">
                      {agent.conversions}/{agent.leads}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 text-right">
                    Taxa: {((agent.conversions / agent.leads) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-slate-400" />
              Motivos de Perda
            </h3>
            <div className="space-y-4">
              {metrics.lossReasons.map((reason) => (
                <div
                  key={reason.reason}
                  className="group hover:bg-slate-50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-sm text-slate-600 w-24">{reason.reason}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full group-hover:bg-rose-600 transition-colors"
                          style={{
                            width: `${(reason.count / metrics.lossReasons.reduce((acc, r) => acc + r.count, 0)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-slate-600">{reason.count}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 text-right">
                    {((reason.count / metrics.lossReasons.reduce((acc, r) => acc + r.count, 0)) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informações de interatividade */}
        <div className="mt-8 text-xs text-slate-400 text-center">
          <p>💡 Dica: Clique nos gráficos para filtrar dados • Use o brush para dar zoom • Clique na legenda para ocultar séries</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;