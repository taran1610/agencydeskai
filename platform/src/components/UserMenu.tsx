'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ROLE_LABELS, type UserRole } from '@/lib/auth/permissions'

export function UserMenu({
  email,
  role,
  compact = false,
}: {
  email: string
  role: UserRole
  compact?: boolean
}) {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={signOut}
        className="rounded-lg p-2 text-[var(--gray-500)] hover:bg-[var(--gray-100)] hover:text-black"
        title="Sign out"
        aria-label="Sign out"
      >
        <LogOut size={18} strokeWidth={1.75} />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {role === 'owner' && (
        <a
          href="/settings/team"
          className="console-label hidden items-center gap-1 text-[var(--gray-600)] hover:text-black sm:inline-flex"
        >
          <Settings size={12} />
          Team
        </a>
      )}
      <div className="hidden max-w-[11rem] truncate text-xs text-[var(--gray-500)] sm:block">
        {email}
      </div>
      <span className="console-label rounded border border-[var(--border)] px-2 py-1">
        {ROLE_LABELS[role]}
      </span>
      <button
        type="button"
        onClick={signOut}
        className="text-[var(--gray-500)] hover:text-black"
        title="Sign out"
        aria-label="Sign out"
      >
        <LogOut size={16} strokeWidth={1.75} />
      </button>
    </div>
  )
}
