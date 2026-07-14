import Link from 'next/link'
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'
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

export function GettingStarted({
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

  if (completed === checklist.length && hasAccount) return null

  return (
    <section className="border border-[var(--border)] bg-white">
      <div className="border-b border-[var(--border)] px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="console-label">Onboarding</p>
            <h2 className="console-title mt-2 text-2xl">Getting started</h2>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              Process your first client file end-to-end.
            </p>
          </div>
          <span className="console-label border border-[var(--border)] px-3 py-1.5">
            {completed} of {checklist.length} complete
          </span>
        </div>
        <div className="mt-5 h-px w-full bg-[var(--border)]">
          <div
            className="h-px bg-[var(--ink)] transition-all"
            style={{ width: `${(completed / checklist.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-[var(--border)]">
        <ul className="space-y-3 border-b border-[var(--border)] p-6 sm:p-8 lg:border-b-0">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-start gap-3 text-sm">
              {item.done ? (
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[var(--ink)]" />
              ) : (
                <Circle size={17} className="mt-0.5 shrink-0 text-[var(--ink-faint)]" />
              )}
              <span className={item.done ? 'text-[var(--ink-faint)] line-through' : 'text-[var(--ink-soft)]'}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        <ol className="divide-y divide-[var(--border)]">
          {STEPS.map((step) => (
            <li key={step.num} className="relative px-6 py-5 sm:px-8">
              <span className="absolute right-6 top-4 font-serif text-3xl text-[var(--cream-muted)] sm:right-8">
                {step.num}
              </span>
              <p className="console-label">Step {step.num}</p>
              <p className="console-card-title mt-2 text-base">{step.title}</p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-[var(--ink-muted)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {(canCreate && !hasAccount) || (hasAccount && accounts[0]) ? (
        <div className="border-t border-[var(--border)] bg-[var(--cream-panel)] px-6 py-4 sm:px-8">
          {canCreate && !hasAccount && (
            <p className="text-sm text-[var(--ink-muted)]">
              Use the form above to create your first client, then upload their document packet.
            </p>
          )}
          {hasAccount && accounts[0] && (
            <Link
              href={`/accounts/${accounts[0].id}`}
              className="console-label inline-flex items-center gap-1.5 text-[var(--ink)] hover:opacity-70"
            >
              Open {accounts[0].name} <ArrowRight size={12} />
            </Link>
          )}
        </div>
      ) : null}
    </section>
  )
}
