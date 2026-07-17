import Link from 'next/link'

export function NoWorkspaceAccess({ email }: { email: string }) {
  return (
    <div className="mx-auto max-w-md border border-[var(--border)] bg-white p-8">
      <p className="console-label">Access</p>
      <h1 className="console-title mt-3 text-2xl">Setting up your workspace…</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        Signed in as <strong className="text-[var(--ink)]">{email}</strong>. Your workspace
        should be created automatically. Refresh this page, or sign out and sign in with Google
        again.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link href="/" className="console-btn-primary">
          Refresh dashboard
        </Link>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="console-label text-[var(--ink-soft)] underline hover:text-[var(--ink)]"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
