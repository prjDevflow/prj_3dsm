import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// ── Progress bar ──────────────────────────────────────────────────
function ProgressBar() {
  const location = useLocation();
  const [width, setWidth]     = useState(0);
  const [opacity, setOpacity] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => {
    clear();
    setOpacity(1);
    setWidth(0);

    const t1 = setTimeout(() => setWidth(35),  10);
    const t2 = setTimeout(() => setWidth(70),  150);
    const t3 = setTimeout(() => setWidth(88),  400);
    const t4 = setTimeout(() => setWidth(100), 550);
    const t5 = setTimeout(() => setOpacity(0), 750);
    const t6 = setTimeout(() => setWidth(0),   950);

    timers.current = [t1, t2, t3, t4, t5, t6];
    return clear;
  }, [location.pathname]);

  return (
    <div
      aria-hidden
      style={{
        position:   'fixed',
        top:        0,
        left:       0,
        height:     '3px',
        width:      `${width}%`,
        opacity,
        zIndex:     99999,
        background: 'linear-gradient(to right, var(--color-primary), #09D8C7)',
        boxShadow:  '0 0 10px rgba(9,216,199,0.5)',
        transition: 'width 0.25s ease-out, opacity 0.2s ease',
        pointerEvents: 'none',
      }}
    />
  );
}

// ── Page transition wrapper ───────────────────────────────────────
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      style={{ animation: 'pageFadeIn 0.22s ease-out both' }}
    >
      {children}
    </div>
  );
}

// ── Combined shell ────────────────────────────────────────────────
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressBar />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
