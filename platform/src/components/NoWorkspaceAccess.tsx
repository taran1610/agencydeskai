import Link from 'next/link'

export function NoWorkspaceAccess({ email }: { email: string }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-lg font-semibold text-slate-900">Workspace access required</h1>
      <p className="mt-2 text-sm text-slate-600">
        Signed in as <strong>{email}</strong>, but this account is not in a workspace yet.
        Ask an agency owner to invite you from Settings → Team.
      </p>
      <form action="/api/auth/signout" method="post" className="mt-6">
        <button
          type="submit"
          className="text-sm font-medium text-slate-600 underline hover:text-slate-900"
        >
          Sign out and try another account
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-400">
        <Link href="/login" className="underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
