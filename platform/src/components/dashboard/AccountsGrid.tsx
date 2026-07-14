import Link from 'next/link'
import { AlertCircle, ArrowRight, FolderOpen } from 'lucide-react'
import type { AccountListItem } from '@/lib/data'

export function AccountsGrid({
  accounts,
  canCreate,
}: {
  accounts: AccountListItem[]
  canCreate: boolean
}) {
  return (
    <section>
      {accounts.length === 0 ? (
        <div className="dash-card border-dashed px-8 py-16 text-center">
          <FolderOpen className="mx-auto text-[var(--gray-300)]" size={36} strokeWidth={1.25} />
          <p className="mt-4 text-sm font-semibold text-black">No client accounts yet</p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[var(--gray-500)]">
            {canCreate
              ? 'Create your first account or load sample data to explore the platform.'
              : 'No accounts in your workspace yet. Ask an owner to create one or send you an invitation.'}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <li key={account.id}>
              <Link href={`/accounts/${account.id}`} className="console-card-link block h-full">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="console-card-title">{account.name}</p>
                  {account.is_demo && (
                    <span className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--gray-500)]">
                      Sample
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-[var(--gray-400)]">
                  Created{' '}
                  {new Date(account.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--gray-500)]">
                  <span>
                    {account.documentCount}{' '}
                    {account.documentCount === 1 ? 'document' : 'documents'}
                  </span>
                  <span>{account.processedDocumentCount} processed</span>
                  {account.pendingReviewCount > 0 && (
                    <span className="flex items-center gap-1 font-semibold text-black">
                      <AlertCircle size={12} />
                      {account.pendingReviewCount} to review
                    </span>
                  )}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-black">
                  Open account <ArrowRight size={12} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
