import { Suspense } from 'react'
import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { BillingPanel } from '@/components/BillingPanel'
import { PageHeader } from '@/components/console/PageHeader'
import { TeamInviteForm } from '@/components/TeamInviteForm'
import { hasAiConfigured, requireConsolePage } from '@/lib/console-page'
import { ROLE_LABELS } from '@/lib/auth/permissions'
import { listPendingInvitations, listTeamMembers } from '@/lib/data'
import { getWorkspaceBilling } from '@/lib/stripe/billing'
import { isStripeConfigured } from '@/lib/stripe/client'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const result = await requireConsolePage()
  if ('noWorkspace' in result) {
    return <NoWorkspaceAccess email={result.noWorkspace} />
  }
  const { auth } = result

  const isOwner = auth.role === 'owner'
  const [members, invitations, billing] = await Promise.all([
    isOwner ? listTeamMembers(auth.workspaceId) : Promise.resolve([]),
    isOwner ? listPendingInvitations(auth.workspaceId) : Promise.resolve([]),
    getWorkspaceBilling(auth.workspaceId),
  ])

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <PageHeader
        role={auth.role}
        section="Settings"
        title="Workspace settings"
        description="Manage your profile, billing, team access, and platform configuration."
      />

      <section className="dash-card p-5">
        <h2 className="text-sm font-semibold text-black">Your profile</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-3">
            <dt className="text-[var(--gray-500)]">Email</dt>
            <dd className="font-medium text-black">{auth.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--gray-500)]">Role</dt>
            <dd className="font-medium text-black">{ROLE_LABELS[auth.role]}</dd>
          </div>
        </dl>
      </section>

      <Suspense fallback={null}>
        <BillingPanel
          billing={billing}
          stripeConfigured={isStripeConfigured()}
          isOwner={isOwner}
        />
      </Suspense>

      <section className="dash-card p-5">
        <h2 className="text-sm font-semibold text-black">AI processing</h2>
        <p className="mt-2 text-xs text-[var(--gray-500)]">
          {hasAiConfigured()
            ? 'API key is configured. Document processing is enabled.'
            : 'No API key detected. Add ANTHROPIC_API_KEY or OPENAI_API_KEY in your Vercel project (agencydeskai-app), then redeploy.'}
        </p>
      </section>

      {isOwner && (
        <>
          <section className="dash-card p-5">
            <h2 className="text-sm font-semibold text-black">Team members</h2>
            <ul className="mt-4 divide-y divide-[var(--border)] text-sm">
              {members.map((member) => (
                <li key={member.id} className="flex items-center justify-between py-3">
                  <span className="text-[var(--gray-700)]">
                    {member.profile?.full_name ?? member.profile?.email ?? member.user_id}
                  </span>
                  <span className="text-xs text-[var(--gray-400)]">
                    {ROLE_LABELS[member.role]}
                    {member.user_id === auth.userId ? ' (you)' : ''}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="dash-card p-5">
            <h2 className="text-sm font-semibold text-black">Invite someone</h2>
            <p className="mt-1 text-xs text-[var(--gray-500)]">
              Reviewers can upload, process, and approve fields. Viewers have read-only access.
            </p>
            <div className="mt-4">
              <TeamInviteForm initialInvitations={invitations} />
            </div>
          </section>
        </>
      )}

      {!isOwner && (
        <section className="dash-card p-5">
          <h2 className="text-sm font-semibold text-black">Team</h2>
          <p className="mt-2 text-xs text-[var(--gray-500)]">
            Only workspace owners can invite team members. Ask your owner for access changes.
          </p>
        </section>
      )}
    </div>
  )
}
