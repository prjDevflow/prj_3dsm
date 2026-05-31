// Base skeleton pulse block
export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

// Table skeleton — N rows mimicking the real table layout
export const TableSkeleton = ({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="w-full">
    {/* header row */}
    <div className="flex gap-4 px-6 py-3 border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1" style={{ maxWidth: i === 0 ? "140px" : undefined } as React.CSSProperties} />
      ))}
    </div>
    {/* data rows */}
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5" style={{ width: c === 0 ? "60%" : `${55 + ((r + c) % 3) * 15}%` } as React.CSSProperties} />
            {c === 0 && <Skeleton className="h-2.5 w-2/5" />}
          </div>
        ))}
      </div>
    ))}
  </div>
);

// KPI card skeleton
export const KpiCardSkeleton = () => (
  <div className="card relative overflow-hidden pt-1">
    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-slate-200 animate-pulse" />
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-3 w-28" />
    </div>
  </div>
);
