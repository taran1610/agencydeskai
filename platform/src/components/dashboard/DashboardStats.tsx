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
    },
    {
      label: 'Documents',
      value: stats.documentCount,
      sub: 'Uploaded',
    },
    {
      label: 'Processed',
      value: stats.processedCount,
      sub: 'AI processed',
    },
    {
      label: 'Fields to review',
      value: stats.pendingReviewCount,
      sub: 'Awaiting review',
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
        </div>
      ))}
    </section>
  )
}
