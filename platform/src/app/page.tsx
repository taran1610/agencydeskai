import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertCircle, FileText, FolderOpen, Users } from 'lucide-react'
import { GettingStarted } from '@/components/GettingStarted'
import { NewAccountForm } from '@/components/NewAccountForm'
import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { getAuthContext, getSignedInUser } from '@/lib/auth/session'
import { canWrite } from '@/lib/auth/permissions'
import { listAccounts, summarizeWorkspace } from '@/lib/data'
import { isSupabaseConfigured } from '@/lib/supabase/admin'
import { ROLE_LABELS } from '@/lib/auth/permissions'

export const dynamic = 'force-dynamic'

function hasAiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY)
}

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect('/login')
  }

  const auth = await getAuthContext()
  if (!auth) {
    const user = await getSignedInUser()
    if (user) {
      return <NoWorkspaceAccess email={user.email} />
    }
    redirect('/login')
  }

  const accounts = await listAccounts(auth.workspaceId)
  const stats = summarizeWorkspace(accounts)
  const canCreate = canWrite(auth.role)

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {ROLE_LABELS[auth.role]} · Operations console
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Client accounts
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Upload insurance documents, let the AI read and extract every field, review with
              your team, then generate account summaries and CRM-ready updates.
            </p>
          </div>
          {canCreate && <NewAccountForm />}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: 'Accounts', value: stats.accountCount },
            { icon: FileText, label: 'Documents', value: stats.documentCount },
            { icon: FolderOpen, label: 'Processed', value: stats.processedCount },
            {
              icon: AlertCircle,
              label: 'Fields to review',
              value: stats.pendingReviewCount,
              warn: stats.pendingReviewCount > 0,
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Icon size={14} />
                  {item.label}
                </div>
                <p
                  className={`mt-1 text-2xl font-semibold ${
                    item.warn ? 'text-amber-700' : 'text-slate-900'
                  }`}
                >
                  {item.value}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <GettingStarted
        accounts={accounts}
        canCreate={canCreate}
        hasAiKey={hasAiConfigured()}
      />

      {accounts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FolderOpen className="mx-auto text-slate-300" size={40} />
          <p className="mt-4 text-base font-medium text-slate-800">No client accounts yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {canCreate
              ? 'Create your first account — e.g. a renewal client — then upload their ACORD forms, loss runs, and dec pages.'
              : 'No accounts in your workspace yet. Ask an owner to create one or send you an invitation.'}
          </p>
        </div>
      ) : (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            All accounts
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <li key={account.id}>
                <Link
                  href={`/accounts/${account.id}`}
                  className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 hover:shadow-md"
                >
                  <p className="font-medium text-slate-900">{account.name}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Created {new Date(account.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-slate-500">
                      {account.documentCount}{' '}
                      {account.documentCount === 1 ? 'document' : 'documents'}
                    </span>
                    <span className="text-slate-400">
                      {account.processedDocumentCount} processed
                    </span>
                    {account.pendingReviewCount > 0 && (
                      <span className="flex items-center gap-1 font-medium text-amber-700">
                        <AlertCircle size={13} />
                        {account.pendingReviewCount} to review
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
