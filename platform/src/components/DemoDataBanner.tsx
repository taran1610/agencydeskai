'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Sparkles, Trash2, X } from 'lucide-react'

export function DemoDataBanner({
  hasDemo,
  canManage,
}: {
  hasDemo: boolean
  canManage: boolean
}) {
  const router = useRouter()
  const [dismissed, setDismissed] = useState(false)
  const [busy, setBusy] = useState<'load' | 'remove' | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!hasDemo && !canManage) return null
  if (dismissed && hasDemo) return null

  async function loadDemo() {
    setBusy('load')
    setError(null)
    try {
      const res = await fetch('/api/demo/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to load sample data')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sample data')
    } finally {
      setBusy(null)
    }
  }

  async function removeDemo() {
    if (!confirm('Remove all sample accounts and their documents? Your real data is kept.')) {
      return
    }
    setBusy('remove')
    setError(null)
    try {
      const res = await fetch('/api/demo/seed', { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to remove sample data')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove sample data')
    } finally {
      setBusy(null)
    }
  }

  if (!hasDemo) {
    return (
      <section className="dash-card flex flex-wrap items-center justify-between gap-4 bg-[var(--gray-50)] p-5">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gray-500)]">
            Try the platform
          </p>
          <p className="mt-1 text-sm text-[var(--gray-600)]">
            Load sample client accounts with processed documents, extracted fields awaiting review,
            and a generated account summary — no uploads required.
          </p>
          {error && <p className="mt-2 text-sm text-black">{error}</p>}
        </div>
        <button
          type="button"
          onClick={loadDemo}
          disabled={busy !== null}
          className="console-btn-primary inline-flex items-center gap-2"
        >
          {busy === 'load' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          Load sample data
        </button>
      </section>
    )
  }

  return (
    <section className="relative dash-card bg-[var(--gray-50)] p-5">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-4 text-[var(--gray-400)] hover:text-black"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
      <div className="flex flex-wrap items-center justify-between gap-4 pr-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gray-500)]">
            Sample data
          </p>
          <p className="mt-1 text-sm text-[var(--gray-600)]">
            Explore <span className="font-semibold text-black">Maple Ridge Logistics</span> for the
            full workflow — documents, field review, flags, and CRM export.
          </p>
          {error && <p className="mt-2 text-sm text-black">{error}</p>}
        </div>
        {canManage && (
          <button
            type="button"
            onClick={removeDemo}
            disabled={busy !== null}
            className="console-btn-secondary inline-flex items-center gap-2"
          >
            {busy === 'remove' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            Remove sample data
          </button>
        )}
      </div>
    </section>
  )
}
