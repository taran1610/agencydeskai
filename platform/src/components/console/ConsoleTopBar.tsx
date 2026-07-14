'use client'

import { Bell, HelpCircle, Search } from 'lucide-react'
import type { UserRole } from '@/lib/auth/permissions'
import { UserMenu } from '@/components/UserMenu'

export function ConsoleTopBar({ email, role }: { email: string; role: UserRole }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--border)] bg-white px-6">
      <div className="relative flex-1 max-w-md">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]"
        />
        <input
          type="search"
          placeholder="Search accounts, documents…"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--gray-50)] py-2 pl-9 pr-16 text-sm text-black outline-none placeholder:text-[var(--gray-400)] focus:border-black"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--border)] bg-white px-1.5 py-0.5 text-[10px] text-[var(--gray-400)] sm:inline">
          ⌘ K
        </kbd>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg p-2 text-[var(--gray-500)] hover:bg-[var(--gray-100)] hover:text-black"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-[var(--gray-500)] hover:bg-[var(--gray-100)] hover:text-black"
          aria-label="Help"
        >
          <HelpCircle size={18} strokeWidth={1.75} />
        </button>
        <UserMenu email={email} role={role} compact />
      </div>
    </header>
  )
}
