export function ConfidenceBadge({ value }: { value: number }) {
  const percent = Math.round(value * 100)
  const tone =
    value >= 0.9
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : value >= 0.7
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-red-50 text-red-700 border-red-200'
  return (
    <span
      className={`inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] font-medium ${tone}`}
      title={`Extraction confidence: ${percent}%`}
    >
      {percent}%
    </span>
  )
}
