import Link from 'next/link'
import { ArrowRight, CheckCircle2, Circle, FolderOpen } from 'lucide-react'
import type { AccountListItem } from '@/lib/data'

const STEPS = [
  {
    num: '01',
    title: 'Create a client account',
    body: 'One account per insured — Maple Ridge Logistics, Smith Family, etc.',
  },
  {
    num: '02',
    title: 'Upload the document packet',
    body: 'ACORDs, loss runs, dec pages, COIs, endorsements. PDF or scanned images.',
  },
  {
    num: '03',
    title: 'Process with AI',
    body: 'Each document is classified and every material field extracted with confidence scores.',
  },
  {
    num: '04',
    title: 'Review, analyze, export',
    body: 'Approve fields, generate the account summary, copy CRM updates, export CSV.',
  },
] as const

export function GettingStartedCard({
  accounts,
  canCreate,
  hasAiKey,
}: {
  accounts: AccountListItem[]
  canCreate: boolean
  hasAiKey: boolean
}) {
  const hasAccount = accounts.length > 0
  const hasDocuments = accounts.some((a) => a.documentCount > 0)
  const hasProcessed = accounts.some((a) => a.processedDocumentCount > 0)
  const hasPendingReview = accounts.some((a) => a.pendingReviewCount > 0)

  const checklist = [
    { done: hasAccount, label: 'Create your first client account' },
    { done: hasDocuments, label: 'Upload at least one document' },
    { done: hasProcessed, label: 'Process documents with AI' },
    { done: hasDocuments && !hasPendingReview, label: 'Review extracted fields' },
    { done: hasAiKey, label: 'AI API key configured (Anthropic or OpenAI)' },
  ]

  const completed = checklist.filter((c) => c.done).length
  const featured = accounts.find((a) => a.is_demo) ?? accounts[0]

  if (completed === checklist.length && hasAccount) return null

  return (
    <section id="review" className="dash-card flex h-full flex-col overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-black">Getting started</h2>
            <p className="mt-0.5 text-xs text-[var(--gray-500)]">
              Follow these steps to process your first client file end-to-end.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--gray-500)]">
            {completed} of {checklist.length} complete
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--gray-100)]">
          <div
            className="h-full rounded-full bg-black transition-all"
            style={{ width: `${(completed / checklist.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid flex-1 lg:grid-cols-[1fr_auto]">
        <ul className="space-y-3 border-b border-[var(--border)] p-5 lg:border-b-0 lg:border-r">
          {checklist.map((item, index) => (
            <li key={item.label} className="flex items-start gap-3">
              {item.done ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-black" strokeWidth={1.75} />
              ) : (
                <Circle size={18} className="mt-0.5 shrink-0 text-[var(--gray-300)]" strokeWidth={1.75} />
              )}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm ${item.done ? 'text-[var(--gray-400)] line-through' : 'font-medium text-black'}`}
                >
                  {item.label}
                </p>
                {index === 0 && item.done && (
                  <span className="mt-1 inline-block rounded border border-black px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black">
                    Completed
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center justify-center bg-[var(--gray-50)] p-6 lg:w-44">
          <div className="relative">
            <FolderOpen size={48} strokeWidth={1.25} className="text-[var(--gray-300)]" />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-black">
              <CheckCircle2 size={14} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {(canCreate && !hasAccount) || featured ? (
        <div className="border-t border-[var(--border)] bg-[var(--gray-50)] px-5 py-3">
          {canCreate && !hasAccount && (
            <p className="text-xs text-[var(--gray-500)]">
              Use the form above to create your first client, then upload their document packet.
            </p>
          )}
          {featured && (
            <Link
              href={`/accounts/${featured.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:opacity-70"
            >
              Open {featured.name} <ArrowRight size={12} />
            </Link>
          )}
        </div>
      ) : null}
    </section>
  )
}

export function ProcessingPipeline() {
  return (
    <section id="processing" className="dash-card flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-sm font-semibold text-black">Processing pipeline</h2>
        <span className="text-xs font-medium text-[var(--gray-400)]">Learn more</span>
      </div>
      <ol className="flex-1 space-y-0 divide-y divide-[var(--border)]">
        {STEPS.map((step, index) => (
          <li key={step.num} className="flex gap-4 px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-black text-xs font-bold text-black">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-black">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--gray-500)]">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
