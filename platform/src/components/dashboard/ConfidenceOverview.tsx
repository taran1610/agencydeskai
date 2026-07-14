export function ConfidenceOverview({
  confidence,
}: {
  confidence: { high: number; medium: number; low: number; average: number; total: number }
}) {
  const { high, medium, low, average, total } = confidence
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0)

  const segments = [
    { label: 'High (90%+)', count: high, pct: pct(high), shade: 'bg-black' },
    { label: 'Medium (70–90%)', count: medium, pct: pct(medium), shade: 'bg-[var(--gray-600)]' },
    { label: 'Low (<70%)', count: low, pct: pct(low), shade: 'bg-[var(--gray-300)]' },
  ]

  const radius = 36
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <section id="analytics" className="dash-card">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-sm font-semibold text-black">AI confidence overview</h2>
      </div>
      <div className="flex flex-col items-center gap-5 p-5 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="var(--gray-100)"
              strokeWidth="10"
            />
            {total > 0 ? (
              segments.map((seg) => {
                const dash = (seg.pct / 100) * circumference
                const el = (
                  <circle
                    key={seg.label}
                    cx="48"
                    cy="48"
                    r={radius}
                    fill="none"
                    stroke={
                      seg.shade === 'bg-black'
                        ? '#000'
                        : seg.shade.includes('600')
                          ? '#525252'
                          : '#d4d4d4'
                    }
                    strokeWidth="10"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="butt"
                  />
                )
                offset += dash
                return el
              })
            ) : null}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-black">
              {total > 0 ? `${Math.round(average * 100)}%` : '—'}
            </span>
            <span className="text-[10px] text-[var(--gray-400)]">Avg. confidence</span>
          </div>
        </div>
        <ul className="w-full space-y-2.5">
          {segments.map((seg) => (
            <li key={seg.label} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-sm ${seg.shade}`} />
                <span className="text-[var(--gray-600)]">{seg.label}</span>
              </div>
              <span className="font-semibold tabular-nums text-black">{seg.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
