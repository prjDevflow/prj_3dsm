import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3, Mail, Lock, Eye, EyeOff,
  TrendingUp, Users, Target, AlertCircle, ArrowRight,
} from 'lucide-react';

const features = [
  { icon: BarChart3, text: 'Dashboard analítico em tempo real' },
  { icon: Users,     text: 'Gestão completa de equipes e leads' },
  { icon: TrendingUp, text: 'Indicadores de conversão e desempenho' },
  { icon: Target,    text: 'Controle de acesso por perfil hierárquico' },
];

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login({ email, password });
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Email ou senha inválidos. Verifique suas credenciais.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Painel esquerdo ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a2d47 0%, #0F3B5E 50%, #1a5276 100%)' }}
      >
        {/* Círculos decorativos */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <BarChart3 size={22} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Analytics<span className="text-blue-300">Pro</span>
            </span>
          </div>
        </div>

        {/* Tagline + features */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Gestão inteligente<br />
              <span className="text-blue-300">de leads</span>
            </h1>
            <p className="text-blue-200/80 mt-3 text-base leading-relaxed">
              Acompanhe métricas, gerencie negociações e tome<br />
              decisões com base em dados reais.
            </p>
          </div>

          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-blue-300" />
                </div>
                <span className="text-blue-100/90 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé do painel */}
        <div className="relative z-10">
          <p className="text-blue-300/50 text-xs">© 2026 AnalyticsPro · Todos os direitos reservados</p>
        </div>
      </div>

      {/* ── Painel direito (formulário) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-slate-50">

        {/* Logo mobile */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
            <BarChart3 size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-800">
            Analytics<span className="text-[var(--color-primary)]">Pro</span>
          </span>
        </div>

        <div className="w-full max-w-sm">

          {/* Cabeçalho do form */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Bem-vindo de volta</h2>
            <p className="text-slate-500 text-sm mt-1">Entre com suas credenciais para continuar</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input w-full pl-10 pr-11"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                <>
                  Entrar <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Credenciais de teste */}
          <div className="mt-8 p-4 bg-slate-100 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Credenciais de teste</p>
            <div className="space-y-1">
              {[
                ['Atendente', 'atendente@email.com'],
                ['Gerente',   'gerente@email.com'],
                ['Admin',     'admin@email.com'],
              ].map(([role, mail]) => (
                <button
                  key={mail}
                  type="button"
                  onClick={() => { setEmail(mail); setPassword('123456'); }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors text-left"
                >
                  <span className="text-xs font-medium text-slate-600">{role}</span>
                  <span className="text-xs text-slate-400">{mail}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
