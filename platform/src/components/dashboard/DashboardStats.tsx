function Sparkline({ seed }: { seed: number }) {
  const points = Array.from({ length: 12 }, (_, i) => {
    const wave = Math.sin(i * 0.9 + seed) * 8
    const trend = i * 1.2
    return 24 - trend * 0.3 - wave
  })
  const path = points.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 10},${y}`).join(' ')

  return (
    <svg viewBox="0 0 110 28" className="h-7 w-full" aria-hidden>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function DashboardStats({
  stats,
}: {
  stats: {
    accountCount: number
    documentCount: number
    processedCount: number
    pendingReviewCount: number
  }
}) {
  const cards = [
    {
      label: 'Accounts',
      value: stats.accountCount,
      sub: 'Total client accounts',
      seed: 1,
    },
    {
      label: 'Documents',
      value: stats.documentCount,
      sub: 'Uploaded',
      seed: 2,
    },
    {
      label: 'Processed',
      value: stats.processedCount,
      sub: 'AI processed',
      seed: 3,
    },
    {
      label: 'Fields to review',
      value: stats.pendingReviewCount,
      sub: 'Awaiting review',
      seed: 4,
    },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="dash-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-[var(--gray-500)]">{card.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-black">{card.value}</p>
              <p className="mt-1 text-xs text-[var(--gray-400)]">{card.sub}</p>
            </div>
          </div>
          <div className="mt-4 text-[var(--gray-300)]">
            <Sparkline seed={card.seed + card.value} />
          </div>
        </div>
      ))}
    </section>
  )
}
