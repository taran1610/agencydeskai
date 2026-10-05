import Link from 'next/link'
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import type { AccountListItem } from '@/lib/data'

const STEPS = [
  {
    num: '01',
    title: 'Create a client account',
    body: 'One account per insured — a business or a household.',
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

export function GettingStartedCard({ accounts }: { accounts: AccountListItem[] }) {
  const hasAccount = accounts.length > 0
  const hasDocuments = accounts.some((a) => a.documentCount > 0)
  const hasProcessed = accounts.some((a) => a.processedDocumentCount > 0)
  const hasPendingReview = accounts.some((a) => a.pendingReviewCount > 0)
  const featured =
    accounts.find((account) => account.pendingReviewCount > 0) ??
    accounts.find((account) => account.documentCount > 0) ??
    accounts[0]

  const checklist = [
    { done: hasAccount, label: 'Create a client account', href: '/accounts' },
    {
      done: hasDocuments,
      label: 'Upload a document packet',
      href: featured ? `/accounts/${featured.id}` : '/accounts',
    },
    {
      done: hasProcessed,
      label: 'Process the documents',
      href: featured ? `/accounts/${featured.id}` : '/processing',
    },
    {
      done: hasProcessed && !hasPendingReview,
      label: 'Review extracted fields',
      href: '/review',
    },
  ]

  const completed = checklist.filter((item) => item.done).length
  const next = checklist.find((item) => !item.done)

  if (!hasAccount || completed === checklist.length) return null

  return (
    <section className="dash-card flex h-full flex-col overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-black">Your next steps</h2>
            <p className="mt-0.5 text-xs text-[var(--gray-500)]">
              Finish the first client file. Checked items are already done.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--gray-500)]">
            {completed} of {checklist.length}
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--gray-100)]">
          <div
            className="h-full rounded-full bg-black transition-all"
            style={{ width: `${(completed / checklist.length) * 100}%` }}
          />
        </div>
      </div>

      <ul className="flex-1 space-y-3 p-5">
        {checklist.map((item) => (
          <li key={item.label} className="flex items-start gap-3">
            {item.done ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-black" strokeWidth={1.75} />
            ) : (
              <Circle size={18} className="mt-0.5 shrink-0 text-[var(--gray-300)]" strokeWidth={1.75} />
            )}
            <p
              className={`text-sm ${item.done ? 'text-[var(--gray-400)] line-through' : 'font-medium text-black'}`}
            >
              {item.label}
            </p>
          </li>
        ))}
      </ul>

      {next && (
        <div className="border-t border-[var(--border)] bg-[var(--gray-50)] px-5 py-3">
          <Link
            href={next.href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:opacity-70"
          >
            Continue: {next.label} <ArrowRight size={12} />
          </Link>
        </div>
      )}
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
