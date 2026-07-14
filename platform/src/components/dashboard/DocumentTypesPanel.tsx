export function DocumentTypesPanel({
  types,
  totalDocuments,
}: {
  types: Array<{ type: string; label: string; count: number }>
  totalDocuments: number
}) {
  const max = types[0]?.count ?? 1

  return (
    <section id="documents" className="dash-card">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-sm font-semibold text-black">Document types</h2>
        <p className="mt-0.5 text-xs text-[var(--gray-500)]">Breakdown of uploaded files</p>
      </div>
      {types.length === 0 ? (
        <p className="px-5 py-8 text-center text-xs text-[var(--gray-400)]">
          No documents yet. Upload your first document to get started.
        </p>
      ) : (
        <ul className="space-y-3 p-5">
          {types.map((item, index) => {
            const width = `${Math.max(8, (item.count / max) * 100)}%`
            const shade =
              index === 0
                ? 'bg-black'
                : index === 1
                  ? 'bg-[var(--gray-600)]'
                  : index === 2
                    ? 'bg-[var(--gray-400)]'
                    : 'bg-[var(--gray-300)]'
            return (
              <li key={item.type}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-black">{item.label}</span>
                  <span className="tabular-nums text-[var(--gray-500)]">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--gray-100)]">
                  <div className={`h-full rounded-full ${shade}`} style={{ width }} />
                </div>
              </li>
            )
          })}
          <p className="pt-1 text-[11px] text-[var(--gray-400)]">{totalDocuments} total documents</p>
        </ul>
      )}
    </section>
  )
}
