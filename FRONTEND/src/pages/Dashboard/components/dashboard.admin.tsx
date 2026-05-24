import { AlertCircle, ChevronDown, ChevronUp, Clock, DollarSign, Phone, Target, Users } from "lucide-react";
import { useState } from "react";
import { Header } from "../../../components/Header";
import KpiCard from "../../../components/KpiCard";
import { useDashboardModel } from "../dashboard.model";
import InteractivePieChart from "../../../components/charts/InteractivePieChart";
import InteractiveLineChart from "../../../components/charts/InteractiveLineChart";
import InteractiveBarChart from "../../../components/charts/InteractiveBarChart";

// Cores semânticas por origem
const ORIGIN_COLORS: Record<string, string> = {
  "WhatsApp":      "#25D366",
  "Facebook":      "#1877F2",
  "Instagram":     "#E1306C",
  "Site":          "#09D8C7",
  "Indicação":     "#17364F",
  "Loja Física":   "#BD0927",
  "Mercado Livre": "#FFE11A",
  "Google Ads":    "#EA4335",
  "LinkedIn":      "#0A66C2",
  "Telefone":      "#8B5CF6",
  "Evento":        "#F97316",
};

// Cores por importância (frio/morno/quente)
const IMPORTANCE_COLORS: Record<string, string> = {
  "frio":   "#3B82F6",
  "morno":  "#F59E0B",
  "quente": "#BD0927",
  "Frio":   "#3B82F6",
  "Morno":  "#F59E0B",
  "Quente": "#BD0927",
  "FRIO":   "#3B82F6",
  "MORNO":  "#F59E0B",
  "QUENTE": "#BD0927",
};

// Paleta vibrante para gráficos genéricos
const VIBRANT = ["#09D8C7","#BD0927","#17364F","#F97316","#8B5CF6","#FFE11A","#10B981","#1877F2","#E1306C","#411E3A"];

type DashboardProps = ReturnType<typeof useDashboardModel>;

export const DashboardAdmin = (props: DashboardProps) => {
  const [showAllPerf, setShowAllPerf] = useState(false);
  const {
    metrics,
    safeArray,
    handleDateRangeChange,
    handleStoreChange,
    handleTeamChange,
    selectedPeriod,
    selectedSource,
    firstName,
    greeting,
    setSelectedPeriod,
    setSelectedSource,
    role,
  } = props;
  const funnel = safeArray(metrics?.funnel);
  const evolution = safeArray(metrics?.evolution);
  const bySource = safeArray(metrics?.bySource);
  const byStatus = safeArray(metrics?.byStatus);
  const byImportance = safeArray(metrics?.byImportance);
  const byStore = safeArray(metrics?.byStore);
  const convertedVsNonConverted = safeArray(metrics?.convertedVsNonConverted).map((item) => ({
    ...item,
    color: item.name === "Convertidos" ? "#10b981" : "#ef4444",
  }));
  const byTeam = safeArray(metrics?.byTeam);
  const performance = safeArray(metrics?.performance);
  const performanceByTeam = safeArray(metrics?.performanceByTeam);
  const lossReasons = safeArray(metrics?.lossReasons);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onDateRangeChange={handleDateRangeChange}
      />
      <main className="max-w-full px-6 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">
            {role === "admin" ? "Painel Executivo" : "Painel Gerencial"}
          </h1>
          <p className="text-base text-slate-500 mt-1">
            {greeting}, {firstName}.
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {role === "admin"
              ? "Visão geral completa da operação"
              : "Visão consolidada de todas as equipes"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Total de Leads"
            value={metrics?.kpis.totalLeads || 0}
            icon={Users}
            change={12}
          />
          <KpiCard
            title="Taxa de Conversão"
            value={`${metrics?.kpis.conversionRate || 0}%`}
            icon={Target}
            change={2.5}
          />
          <KpiCard
            title="Ticket Médio"
            value={`R$ ${metrics?.kpis.avgDealValue?.toLocaleString() || 0}`}
            icon={DollarSign}
            change={-1.2}
          />
          <KpiCard
            title="Tempo Médio Atendimento"
            value={metrics?.avgTimeToFirstContact || "—"}
            icon={Clock}
          />
        </div>

        {(selectedPeriod || selectedSource) && (
          <div className="mb-4 flex items-center space-x-2">
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
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-5 flex flex-col lg:col-span-1">
            <h3 className="text-lg font-semibold text-slate-700 mb-3 flex-shrink-0">
              Funil de Vendas
            </h3>
            <div className="flex-1 min-h-0">
              <InteractivePieChart
                data={funnel.map((item, i) => ({
                  name:  item.stage,
                  value: item.count,
                  color: VIBRANT[i % VIBRANT.length],
                }))}
              />
            </div>
          </div>
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Evolução de Leads
            </h3>
            <InteractiveLineChart data={evolution} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Por Origem
            </h3>
            <InteractiveBarChart
              data={bySource.map((item) => ({
                name:  item.source,
                value: item.count,
                color: ORIGIN_COLORS[item.source],
              }))}
              onBarClick={(point) => setSelectedSource(point.name)}
            />
          </div>
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Por Status
            </h3>
            <InteractiveBarChart
              data={byStatus.map((item, i) => ({
                name:  item.status,
                value: item.count,
                color: VIBRANT[i % VIBRANT.length],
              }))}
            />
          </div>
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Importância
            </h3>
            <InteractiveBarChart
              data={byImportance.map((item) => ({
                name:  item.importance,
                value: item.count,
                color: IMPORTANCE_COLORS[item.importance],
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Leads por Loja
            </h3>
            <InteractiveBarChart
              data={byStore.map((item, i) => ({
                name:  item.store,
                value: item.count,
                color: VIBRANT[i % VIBRANT.length],
              }))}
            />
          </div>
          <div className="card p-5 flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex-shrink-0">
              Convertidos vs Não Convertidos
            </h3>
            <div className="flex-1 min-h-0">
              <InteractivePieChart data={convertedVsNonConverted} />
            </div>
          </div>
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Leads por Equipe
            </h3>
            <InteractiveBarChart
              data={byTeam.map((item) => ({
                name: item.team,
                value: item.count,
              }))}
            />
          </div>
        </div>

        <div className="card p-5 mb-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
            <Phone className="mr-2 h-5 w-5 text-slate-400" />
            Performance dos Atendentes
          </h3>
          {(() => {
            const sorted = [...performance].sort((a, b) => {
              const rateA = a.leads > 0 ? a.conversions / a.leads : 0;
              const rateB = b.leads > 0 ? b.conversions / b.leads : 0;
              return rateB - rateA;
            });
            const visible = showAllPerf ? sorted : sorted.slice(0, 5);
            return (
              <>
                <div className="space-y-3">
                  {visible.map((agent, idx) => {
                    const rate = agent.leads > 0 ? (agent.conversions / agent.leads) * 100 : 0;
                    const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
                    return (
                      <div key={agent.agent} className="flex items-center gap-3">
                        <span className="text-base w-6 text-center">{medal ?? <span className="text-xs text-slate-400">{idx + 1}º</span>}</span>
                        <span className="text-sm text-slate-700 w-28 truncate font-medium">{agent.agent}</span>
                        <div className="flex-1">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${rate}%`,
                                backgroundColor: VIBRANT[idx % VIBRANT.length],
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 w-24 text-right">
                          {agent.conversions}/{agent.leads} ({rate.toFixed(1)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
                {sorted.length > 5 && (
                  <button
                    onClick={() => setShowAllPerf((v) => !v)}
                    className="mt-4 flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline"
                  >
                    {showAllPerf
                      ? <><ChevronUp size={13} /> Ver menos</>
                      : <><ChevronDown size={13} /> Ver todos ({sorted.length - 5} mais)</>}
                  </button>
                )}
              </>
            );
          })()}
        </div>

        {performanceByTeam.length > 0 && (
          <div className="card p-5 mb-8">
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5 text-slate-400" />
              Performance por Equipe
            </h3>
            <div className="space-y-4">
              {performanceByTeam.map((t) => {
                const rate = t.leads > 0 ? (t.conversions / t.leads) * 100 : 0;
                return (
                  <div key={t.team} className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 w-32 truncate">{t.team}</span>
                    <div className="flex-1">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 w-28 text-right">
                      {t.conversions}/{t.leads} ({rate.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="card p-5">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-slate-400" />
            Motivos de Perda
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
            💡 Dica: Clique nos gráficos para filtrar dados • Use o brush para
            dar zoom • Clique na legenda para ocultar séries
          </p>
        </div>
      </main>
    </div>
  );
};
