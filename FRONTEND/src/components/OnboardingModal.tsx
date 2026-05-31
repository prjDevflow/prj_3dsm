import { useState } from "react";
import { BarChart2, Users, TrendingUp, Bell, CheckCircle, X, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = [
  {
    icon: CheckCircle,
    color: "text-emerald-500",
    bg:    "bg-emerald-50",
    title: "Bem-vindo ao 1000Valle CRM!",
    desc:  "Seu sistema de gestão de leads está pronto. Em menos de 2 minutos vamos te mostrar tudo que você precisa saber para começar.",
  },
  {
    icon: Users,
    color: "text-blue-500",
    bg:    "bg-blue-50",
    title: "Gerencie seus Leads",
    desc:  "Na página Leads você cria, edita e acompanha todos os seus clientes potenciais. Use as abas Novos, Em Andamento e Finalizados para organizar o pipeline.",
  },
  {
    icon: TrendingUp,
    color: "text-purple-500",
    bg:    "bg-purple-50",
    title: "Acompanhe as Negociações",
    desc:  "Dentro de cada lead você registra negociações com estágio, importância e observações. Avance etapas e finalize como Ganho ou Perdido.",
  },
  {
    icon: BarChart2,
    color: "text-amber-500",
    bg:    "bg-amber-50",
    title: "Visualize o Dashboard",
    desc:  "O Dashboard mostra KPIs em tempo real — leads, conversões, taxa e comparação com o período anterior. Gerentes e admins também veem carga por atendente.",
  },
  {
    icon: Bell,
    color: "text-rose-500",
    bg:    "bg-rose-50",
    title: "Notificações e Lembretes",
    desc:  "O sino no cabeçalho avisa quando chega um lead novo. Dentro de cada lead você pode criar lembretes com data para não perder nenhum follow-up.",
  },
];

const STORAGE_KEY = "onboarding_v1_done";

export const OnboardingModal = () => {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));
  const [step, setStep] = useState(0);

  if (!visible) return null;

  const { icon: Icon, color, bg, title, desc } = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === step ? "w-6 bg-[var(--color-primary)]" : "w-3 bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>
          <button onClick={finish} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 flex-1 text-center">
          <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-5`}>
            <Icon size={32} className={color} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">{title}</h2>
          <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 disabled:opacity-0"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          <span className="text-xs text-slate-400">{step + 1} / {STEPS.length}</span>

          {isLast ? (
            <button onClick={finish} className="btn-primary flex items-center gap-1.5 text-sm">
              <CheckCircle size={15} /> Começar!
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Próximo <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
