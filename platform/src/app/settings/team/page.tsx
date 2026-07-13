import { notFound, redirect } from 'next/navigation'
import { TeamInviteForm } from '@/components/TeamInviteForm'
import { getAuthContext } from '@/lib/auth/session'
import { listPendingInvitations, listTeamMembers } from '@/lib/data'
import { ROLE_LABELS } from '@/lib/auth/permissions'

export const dynamic = 'force-dynamic'

export default async function TeamSettingsPage() {
  const auth = await getAuthContext()
  if (!auth) redirect('/login')
  if (auth.role !== 'owner') notFound()

  const [members, invitations] = await Promise.all([
    listTeamMembers(auth.workspaceId),
    listPendingInvitations(auth.workspaceId),
  ])

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Team</h1>
        <p className="mt-1 text-sm text-slate-500">
          Invite reviewers and viewers. Only owners can manage the team.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-800">Members</h2>
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          {members.map((member) => (
            <li key={member.id} className="flex items-center justify-between py-2.5">
              <span className="text-slate-700">
                {member.profile?.full_name ?? member.profile?.email ?? member.user_id}
              </span>
              <span className="text-xs text-slate-400">
                {ROLE_LABELS[member.role]}
                {member.user_id === auth.userId ? ' (you)' : ''}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-800">Invite someone</h2>
        <div className="mt-4">
          <TeamInviteForm initialInvitations={invitations} />
        </div>
      </section>
    </div>
  )
}
