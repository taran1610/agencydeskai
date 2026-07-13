import Link from 'next/link'
import { FolderOpen, AlertCircle } from 'lucide-react'
import { NewAccountForm } from '@/components/NewAccountForm'
import { listAccounts } from '@/lib/data'
import { isSupabaseConfigured } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-amber-200 bg-amber-50 p-6">
        <h1 className="text-base font-semibold text-amber-900">Almost there — connect Supabase</h1>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-amber-900/80">
          <li>
            Apply <code>supabase/migrations/202607131400_platform_core.sql</code> to your
            Supabase project.
          </li>
          <li>
            Copy <code>platform/.env.example</code> to <code>platform/.env.local</code> and
            fill in <code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>, and an
            AI API key.
          </li>
          <li>Restart the dev server.</li>
        </ol>
      </div>
    )
  }

  const accounts = await listAccounts()

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Client accounts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            One account per client file. Upload documents, let the AI read them, then
            review and approve.
          </p>
        </div>
        <NewAccountForm />
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
          <FolderOpen className="mx-auto text-slate-300" size={32} />
          <p className="mt-3 text-sm font-medium text-slate-700">No accounts yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first client account to start processing documents.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <li key={account.id}>
              <Link
                href={`/accounts/${account.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400"
              >
                <p className="font-medium text-slate-900">{account.name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Created {new Date(account.created_at).toLocaleDateString()}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs">
                  <span className="text-slate-500">
                    {account.documentCount}{' '}
                    {account.documentCount === 1 ? 'document' : 'documents'}
                  </span>
                  {account.pendingReviewCount > 0 && (
                    <span className="flex items-center gap-1 font-medium text-amber-700">
                      <AlertCircle size={13} />
                      {account.pendingReviewCount} fields to review
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
