import { AlertCircle, DollarSign, Phone, Target, TrendingUp, UsersIcon } from "lucide-react";
import { Header } from "../../../components/Header";
import KpiCard from "../../../components/KpiCard";
import { useDashboardModel } from "../dashboard.model";
import InteractiveLineChart from "../../../components/charts/InteractiveLineChart";
import InteractiveBarChart from "../../../components/charts/InteractiveBarChart";
import InteractivePieChart from "../../../components/charts/InteractivePieChart";

type DashboardProps = ReturnType<typeof useDashboardModel>;

export const DashboardGerente = (props: DashboardProps) => {
  const {
    metrics,
    safeArray,
    handleDateRangeChange,
    handleStoreChange,
    handleTeamChange,
    selectedPeriod,
    selectedSource,
    selectedAgent,
    firstName,
    greeting,
    setSelectedPeriod,
    setSelectedSource,
    setSelectedAgent,
  } = props;
  const bySource = safeArray(metrics?.bySource);
  const byStatus = safeArray(metrics?.byStatus);
  const byImportance = safeArray(metrics?.byImportance);
  const evolution = safeArray(metrics?.evolution);
  const performance = safeArray(metrics?.performance);
  const lossReasons = safeArray(metrics?.lossReasons);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onDateRangeChange={handleDateRangeChange}
      />
      <main className="max-w-full px-6 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">
            Painel da Equipe
          </h1>
          <p className="text-base text-slate-500 mt-1">
            {greeting}, {firstName}.
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Acompanhe a performance da sua equipe
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Leads da Equipe"
            value={metrics?.kpis.totalLeads || 0}
            icon={UsersIcon}
            change={12}
          />
          <KpiCard
            title="Conversões da Equipe"
            value={metrics?.kpis.convertedLeads || 0}
            icon={Target}
            change={8}
          />
          <KpiCard
            title="Taxa da Equipe"
            value={`${metrics?.kpis.conversionRate || 0}%`}
            icon={TrendingUp}
            change={2.5}
          />
          <KpiCard
            title="Receita da Equipe"
            value={`R$ ${metrics?.kpis.totalRevenue?.toLocaleString() || 0}`}
            icon={DollarSign}
            change={8.3}
          />
        </div>

        {(selectedPeriod || selectedSource || selectedAgent) && (
          <div className="mb-4 flex items-center space-x-2 flex-wrap gap-2">
            <span className="text-xs text-slate-500">Filtros ativos:</span>
            {selectedPeriod && (
              <button
                onClick={() => setSelectedPeriod(null)}
                className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs"
              >
                Período: {selectedPeriod} <span className="ml-1">×</span>
              </button>
            )}
            {selectedSource && (
              <button
                onClick={() => setSelectedSource(null)}
                className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs"
              >
                Origem: {selectedSource} <span className="ml-1">×</span>
              </button>
            )}
            {selectedAgent && (
              <button
                onClick={() => setSelectedAgent(null)}
                className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs"
              >
                Atendente: {selectedAgent} <span className="ml-1">×</span>
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Evolução da Equipe
            </h3>
            <InteractiveLineChart data={evolution} />
          </div>
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Leads por Origem
            </h3>
            <InteractiveBarChart
              data={bySource.map((item) => ({
                name: item.source,
                value: item.count,
              }))}
              onBarClick={(point) => setSelectedSource(point.name)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Leads por Status
            </h3>
            <InteractiveBarChart
              data={byStatus.map((item) => ({
                name: item.status,
                value: item.count,
              }))}
            />
          </div>
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Distribuição por Importância
            </h3>
            <InteractivePieChart
              data={byImportance.map((item) => ({
                name: item.importance,
                value: item.count,
              }))}
            />
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
                className={`group p-2 rounded-lg transition-colors cursor-pointer ${selectedAgent === agent.agent ? "bg-slate-100" : "hover:bg-slate-50"}`}
                onClick={() =>
                  setSelectedAgent(
                    selectedAgent === agent.agent ? null : agent.agent,
                  )
                }
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium text-slate-700 w-24">
                    {agent.agent}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full"
                        style={{
                          width: `${(agent.conversions / agent.leads) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {((agent.conversions / agent.leads) * 100).toFixed(1)}%
                  </span>
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
                <span className="text-sm text-slate-600 w-24">
                  {reason.reason}
                </span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{
                        width: `${(reason.count / lossReasons.reduce((acc, r) => acc + r.count, 0)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm text-slate-600">{reason.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-xs text-slate-400 text-center">
          <p>
            💡 Dica: Clique nos atendentes para filtrar dados • Clique nos
            gráficos para explorar
          </p>
        </div>
      </main>
    </div>
  );
};
