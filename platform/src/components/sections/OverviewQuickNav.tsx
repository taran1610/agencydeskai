import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Database,
  FileText,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react'

const LINKS = [
  {
    href: '/accounts',
    label: 'Client accounts',
    description: 'Manage insureds and open account workspaces',
    icon: Users,
  },
  {
    href: '/documents',
    label: 'Documents',
    description: 'All uploaded files across every account',
    icon: FileText,
  },
  {
    href: '/processing',
    label: 'Processing',
    description: 'Queue of documents waiting for AI extraction',
    icon: Sparkles,
  },
  {
    href: '/review',
    label: 'Review & approval',
    description: 'Extracted fields awaiting human sign-off',
    icon: UserCheck,
  },
  {
    href: '/exports',
    label: 'CRM & exports',
    description: 'Download CSV, reports, and CRM-ready blocks',
    icon: Database,
  },
  {
    href: '/analytics',
    label: 'Analytics',
    description: 'Confidence scores, document mix, and review stats',
    icon: BarChart3,
  },
] as const

export function OverviewQuickNav() {
  return (
    <section className="dash-card">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-sm font-semibold text-black">Jump to a section</h2>
        <p className="mt-0.5 text-xs text-[var(--gray-500)]">
          Each area has its own dedicated view
        </p>
      </div>
      <ul className="grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((link) => {
          const Icon = link.icon
          return (
            <li key={link.href} className="bg-white">
              <Link
                href={link.href}
                className="flex h-full flex-col px-5 py-4 transition hover:bg-[var(--gray-50)]"
              >
                <Icon size={18} className="text-[var(--gray-600)]" strokeWidth={1.75} />
                <p className="mt-3 text-sm font-semibold text-black">{link.label}</p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-[var(--gray-500)]">
                  {link.description}
                </p>
                <span className="console-label mt-3 inline-flex items-center gap-1 text-black">
                  Open <ArrowRight size={11} />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
