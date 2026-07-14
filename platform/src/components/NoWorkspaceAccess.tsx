import Link from 'next/link'

export function NoWorkspaceAccess({ email }: { email: string }) {
  return (
    <div className="mx-auto max-w-md border border-[var(--border)] bg-white p-8">
      <p className="console-label">Access</p>
      <h1 className="console-title mt-3 text-2xl">Workspace access required</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        Signed in as <strong className="text-[var(--ink)]">{email}</strong>, but this account
        is not in a workspace yet. Ask an agency owner to invite you from Settings → Team.
      </p>
      <form action="/api/auth/signout" method="post" className="mt-6">
        <button
          type="submit"
          className="console-label text-[var(--ink-soft)] underline hover:text-[var(--ink)]"
        >
          Sign out and try another account
        </button>
      </form>
      <p className="console-label mt-8 text-center">
        <Link href="/login" className="underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
