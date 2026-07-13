'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Settings, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ROLE_LABELS, type UserRole } from '@/lib/auth/permissions'

export function UserMenu({ email, role }: { email: string; role: UserRole }) {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3">
      {role === 'owner' && (
        <a
          href="/settings/team"
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
        >
          <Settings size={13} /> Team
        </a>
      )}
      <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5">
        <User size={13} className="text-slate-400" />
        <span className="max-w-[140px] truncate text-xs text-slate-600">{email}</span>
        <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
          {ROLE_LABELS[role]}
        </span>
      </div>
      <button
        type="button"
        onClick={signOut}
        className="text-slate-400 hover:text-slate-700"
        title="Sign out"
      >
        <LogOut size={15} />
      </button>
    </div>
  )
}
