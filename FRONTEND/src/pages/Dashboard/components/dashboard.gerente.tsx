import { AlertCircle, ChevronDown, ChevronUp, Clock, Inbox, Phone, Target, TrendingUp, UsersIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KpiCard from "../../../components/KpiCard";
import { useDashboardModel } from "../dashboard.model";
import InteractiveLineChart from "../../../components/charts/InteractiveLineChart";
import InteractiveBarChart from "../../../components/charts/InteractiveBarChart";
import InteractivePieChart from "../../../components/charts/InteractivePieChart";
import { useUserAvatar } from "../../../hooks/useUserAvatar";

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

const VIBRANT = ["#09D8C7","#BD0927","#17364F","#F97316","#8B5CF6","#FFE11A","#10B981","#1877F2","#E1306C","#411E3A"];

const ROLE_LABELS: Record<string, string> = {
  atendente:     "Atendente",
  gerente:       "Gerente",
  gerente_geral: "Gerente Geral",
  admin:         "Administrador",
};

type DashboardProps = ReturnType<typeof useDashboardModel>;

export const DashboardGerente = (props: DashboardProps) => {
  const [showAllConv, setShowAllConv] = useState(false);
  const [showAllPerf, setShowAllPerf] = useState(false);
  const [showAllLoss, setShowAllLoss] = useState(false);
  const {
    metrics,
    prevMetrics,
    kpiDelta,
    safeArray,
    selectedPeriod,
    selectedSource,
    selectedAgent,
    firstName,
    greeting,
    role,
    user,
    setSelectedPeriod,
    setSelectedSource,
    setSelectedAgent,
  } = props;

  const navigate = useNavigate();
  const avatar = useUserAvatar();
  const fullName = user?.nome || user?.name || firstName;
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join("");

  const bySource = safeArray(metrics?.bySource);
  const byStatus = safeArray(metrics?.byStatus);
  const byImportance = safeArray(metrics?.byImportance);
  const evolution = safeArray(metrics?.evolution);
  const performance = safeArray(metrics?.performance);
  const lossReasons = safeArray(metrics?.lossReasons);

  return (
    <main className="max-w-full px-6 md:px-8 py-8">
        {/* Header card — avatar + identidade + métricas da equipe */}
        <div className="card p-5 mb-8 flex items-center gap-5">
          {avatar ? (
            <img src={avatar} alt="" className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
          ) : (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 select-none"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              {greeting}
            </p>
            <h1 className="text-xl font-bold text-slate-800 leading-tight truncate">
              {fullName}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {ROLE_LABELS[role ?? ""] ?? role} · Painel da Equipe
            </p>
          </div>

          <div className="hidden sm:flex items-stretch gap-6 divide-x divide-slate-100">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800 leading-none">
                {metrics?.kpis.totalLeads ?? 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Leads</p>
            </div>
            <div className="pl-6 text-right">
              <p className="text-2xl font-bold text-slate-800 leading-none">
                {metrics?.kpis.convertedLeads ?? 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Conversões</p>
            </div>
            <div className="pl-6 text-right">
              <p className="text-2xl font-bold leading-none" style={{ color: "var(--color-primary)" }}>
                {metrics?.kpis.conversionRate ?? 0}%
              </p>
              <p className="text-xs text-slate-400 mt-1">Taxa</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Leads da Equipe"
            value={metrics?.kpis.totalLeads || 0}
            icon={UsersIcon}
            change={kpiDelta?.(metrics?.kpis.totalLeads ?? 0, prevMetrics?.kpis.totalLeads ?? 0)}
          />
          <KpiCard
            title="Conversões da Equipe"
            value={metrics?.kpis.convertedLeads || 0}
            icon={Target}
            change={kpiDelta?.(metrics?.kpis.convertedLeads ?? 0, prevMetrics?.kpis.convertedLeads ?? 0)}
          />
          <KpiCard
            title="Taxa da Equipe"
            value={`${metrics?.kpis.conversionRate || 0}%`}
            icon={TrendingUp}
            change={kpiDelta?.(parseFloat(String(metrics?.kpis.conversionRate ?? 0)), parseFloat(String(prevMetrics?.kpis.conversionRate ?? 0)))}
          />
          <KpiCard
            title="Tempo Médio de Atendimento"
            value={metrics?.avgTimeToFirstContact || "—"}
            icon={Clock}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Evolução da Equipe
            </h3>
            <InteractiveLineChart data={evolution} />
          </div>
          <div className="card p-5 flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex-shrink-0">
              Importância
            </h3>
            <div className="flex-1 min-h-[300px]">
              <InteractivePieChart
                data={byImportance.map((item) => ({
                  name: item.importance,
                  value: item.count,
                  color: IMPORTANCE_COLORS[item.importance],
                }))}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Leads por Origem
            </h3>
            <InteractiveBarChart
              data={bySource.map((item) => ({
                name: item.source,
                value: item.count,
                color: ORIGIN_COLORS[item.source],
              }))}
              onBarClick={(point) => setSelectedSource(point.name)}
            />
          </div>
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Leads por Status
            </h3>
            <InteractiveBarChart
              data={byStatus.map((item, i) => ({
                name: item.status,
                value: item.count,
                color: VIBRANT[i % VIBRANT.length],
              }))}
            />
          </div>
        </div>

        <div className="card p-5 mb-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
            <Phone className="mr-2 h-5 w-5 text-slate-400" />
            Taxa de Conversão por Atendente
          </h3>
          <div className="space-y-4">
            {performance.slice(0, showAllConv ? undefined : 5).map((agent) => (
              <div
                key={agent.agent}
                className={`group p-2 rounded-lg transition-colors ${selectedAgent === agent.agent ? "bg-slate-100" : "hover:bg-slate-50"}`}
                onClick={() =>
                  setSelectedAgent(
                    selectedAgent === agent.agent ? null : agent.agent,
                  )
                }
              >
                <div className="flex items-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/leads?search=${encodeURIComponent(agent.agent)}`); }}
                    className="text-sm font-medium text-[var(--color-primary)] w-24 text-left hover:underline truncate"
                    title={`Ver leads de ${agent.agent}`}
                  >
                    {agent.agent}
                  </button>
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
          {performance.length > 5 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowAllConv((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
              >
                {showAllConv
                  ? <><ChevronUp size={13} /> Ver menos</>
                  : <><ChevronDown size={13} /> Ver todos ({performance.length})</>}
              </button>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-slate-400" />
            Motivos de Finalização
          </h3>
          <div className="space-y-4">
            {lossReasons.slice(0, showAllLoss ? undefined : 5).map((reason) => (
              <div key={reason.reason} className="flex items-center">
                <span className="text-sm text-slate-600 w-24 truncate" title={reason.reason}>
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
          {lossReasons.length > 5 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowAllLoss((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
              >
                {showAllLoss
                  ? <><ChevronUp size={13} /> Ver menos</>
                  : <><ChevronDown size={13} /> Ver todos ({lossReasons.length})</>}
              </button>
            </div>
          )}
        </div>

        {/* ── Carga por Atendente ── */}
        {performance.length > 0 && (
          <div className="card p-5 mt-6">
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Inbox size={18} className="text-slate-400" />
              Carga de Leads por Atendente
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                    <th className="text-left py-2 pr-4">Atendente</th>
                    <th className="text-center py-2 px-4">Em aberto</th>
                    <th className="text-center py-2 px-4">Total</th>
                    <th className="text-center py-2 px-4">Conversões</th>
                    <th className="text-right py-2 pl-4">Taxa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[...performance]
                    .sort((a, b) => (b.openLeads ?? 0) - (a.openLeads ?? 0))
                    .slice(0, showAllPerf ? undefined : 5)
                    .map((agent) => {
                      const taxa = agent.leads > 0 ? Math.round((agent.conversions / agent.leads) * 100) : 0;
                      const openLeads = agent.openLeads ?? 0;
                      const urgency = openLeads >= 20 ? "text-rose-600 font-bold" : openLeads >= 10 ? "text-amber-600 font-semibold" : "text-slate-700";
                      return (
                        <tr key={agent.agent} className="hover:bg-slate-50">
                          <td className="py-2.5 pr-4 font-medium text-slate-700">{agent.agent}</td>
                          <td className={`py-2.5 px-4 text-center ${urgency}`}>{openLeads}</td>
                          <td className="py-2.5 px-4 text-center text-slate-500">{agent.leads}</td>
                          <td className="py-2.5 px-4 text-center text-emerald-600">{agent.conversions}</td>
                          <td className="py-2.5 pl-4 text-right">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${taxa >= 50 ? "bg-emerald-50 text-emerald-700" : taxa >= 20 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                              {taxa}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-slate-400">
                  Vermelho: ≥20 leads em aberto · Amarelo: ≥10 leads em aberto
                </p>
                {performance.length > 5 && (
                  <button
                    onClick={() => setShowAllPerf((v) => !v)}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
                  >
                    {showAllPerf ? (
                      <><ChevronUp size={13} /> Ver menos</>
                    ) : (
                      <><ChevronDown size={13} /> Ver todos ({performance.length})</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-xs text-slate-400 text-center">
          <p>
            💡 Dica: Clique nos atendentes para filtrar dados • Clique nos
            gráficos para explorar
          </p>
        </div>
    </main>
  );
};
