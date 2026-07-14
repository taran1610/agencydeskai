'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  BarChart3,
  Bot,
  ChevronDown,
  Database,
  FileText,
  LayoutDashboard,
  Plug,
  Settings,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react'
import type { UserRole } from '@/lib/auth/permissions'
import { ROLE_LABELS } from '@/lib/auth/permissions'

const NAV = [
  { href: '/', label: 'Overview', icon: LayoutDashboard, section: null },
  { href: '/#accounts', label: 'Client accounts', icon: Users, section: 'accounts' },
  { href: '/#documents', label: 'Documents', icon: FileText, section: 'documents' },
  { href: '/#processing', label: 'Processing', icon: Sparkles, section: 'processing' },
  { href: '/#review', label: 'Review & approval', icon: UserCheck, section: 'review' },
  { href: '/#exports', label: 'CRM & exports', icon: Database, section: 'exports' },
  { href: '/#analytics', label: 'Analytics', icon: BarChart3, section: 'analytics' },
  { href: '/#integrations', label: 'Integrations', icon: Plug, section: 'integrations' },
  {
    href: '/settings/team',
    label: 'Settings',
    icon: Settings,
    section: 'settings',
    ownerOnly: true,
  },
] as const

function readHash() {
  if (typeof window === 'undefined') return ''
  return window.location.hash.replace('#', '')
}

export function ConsoleSidebar({
  email,
  role,
  displayName,
  hasAiKey,
}: {
  email: string
  role: UserRole
  displayName: string | null
  hasAiKey: boolean
}) {
  const pathname = usePathname()
  const [hash, setHash] = useState(readHash)

  useEffect(() => {
    const syncHash = () => setHash(readHash())
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  // Sync hash when navigating back to dashboard without full reload
  useEffect(() => {
    setHash(readHash())
  }, [pathname])

  const name = displayName ?? email.split('@')[0] ?? 'User'
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  function isActive(item: (typeof NAV)[number]) {
    if (item.href === '/settings/team') {
      return pathname.startsWith('/settings')
    }
    if (pathname.startsWith('/accounts/') && item.section === 'accounts') {
      return true
    }
    if (pathname !== '/') return false

    if (item.section === null) return hash === ''
    return hash === item.section
  }

  return (
    <aside className="flex h-full w-[15.5rem] shrink-0 flex-col border-r border-[var(--border)] bg-white">
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
          <Bot size={18} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-black">AgencyDesk AI</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--gray-400)]">
            Pro
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV.filter((item) => !('ownerOnly' in item && item.ownerOnly) || role === 'owner').map(
          (item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (item.section !== null && pathname === '/') {
                    setHash(item.section)
                  } else if (item.section === null) {
                    setHash('')
                  }
                }}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-black text-white'
                    : 'text-[var(--gray-600)] hover:bg-[var(--gray-100)] hover:text-black'
                }`}
              >
                <Icon size={16} strokeWidth={1.75} />
                {item.label}
              </Link>
            )
          },
        )}
      </nav>

      <div className="space-y-3 border-t border-[var(--border)] p-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--gray-50)] p-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${hasAiKey ? 'bg-black' : 'border border-black bg-white'}`}
            />
            <p className="text-xs font-semibold text-black">
              AI Processing: {hasAiKey ? 'Ready to go' : 'Needs API key'}
            </p>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--gray-500)]">
            {hasAiKey
              ? 'Documents will be classified and extracted automatically.'
              : 'Add ANTHROPIC_API_KEY in Vercel to enable live processing.'}
          </p>
          <Link
            href="/#processing"
            onClick={() => setHash('processing')}
            className="mt-2 inline-block text-[11px] font-semibold text-black underline"
          >
            View settings
          </Link>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg px-1 py-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-black">{name}</p>
            <p className="truncate text-[11px] text-[var(--gray-500)]">{email}</p>
          </div>
          <span className="console-label hidden text-[9px] lg:inline">{ROLE_LABELS[role]}</span>
          <ChevronDown size={14} className="shrink-0 text-[var(--gray-400)]" />
        </div>
      </div>
    </aside>
  )
}
