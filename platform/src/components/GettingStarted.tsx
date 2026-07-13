import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  FileUp,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import type { AccountListItem } from '@/lib/data'

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create a client account',
    body: 'One account per insured — Maple Ridge Logistics, Smith Family, etc.',
  },
  {
    icon: FileUp,
    title: 'Upload the document packet',
    body: 'ACORDs, loss runs, dec pages, COIs, endorsements. PDF or scanned images.',
  },
  {
    icon: Sparkles,
    title: 'Process with AI',
    body: 'Each document is classified and every material field extracted with confidence scores.',
  },
  {
    icon: CheckCircle2,
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
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Getting started</h2>
            <p className="mt-1 text-sm text-slate-500">
              Follow these steps to process your first client file end-to-end.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {completed} of {checklist.length} complete
          </span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all"
            style={{ width: `${(completed / checklist.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <ul className="space-y-2.5">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5 text-sm">
              {item.done ? (
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              ) : (
                <Circle size={18} className="shrink-0 text-slate-300" />
              )}
              <span className={item.done ? 'text-slate-500 line-through' : 'text-slate-700'}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        <ol className="space-y-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Step {i + 1}
                  </p>
                  <p className="text-sm font-medium text-slate-800">{step.title}</p>
                  <p className="text-xs text-slate-500">{step.body}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {canCreate && !hasAccount && (
        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-sm text-slate-600">
            Use the <strong>New account</strong> form above to create your first client, then
            upload their document packet.
          </p>
        </div>
      )}

      {hasAccount && accounts[0] && (
        <div className="border-t border-slate-100 px-6 py-4">
          <Link
            href={`/accounts/${accounts[0].id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-slate-600"
          >
            Open {accounts[0].name} <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}
