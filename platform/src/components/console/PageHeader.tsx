import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ROLE_LABELS, type UserRole } from '@/lib/auth/permissions'

export function PageHeader({
  role,
  section,
  title,
  description,
  action,
}: {
  role: UserRole
  section: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div className="min-w-0 flex-1">
        <nav className="flex items-center gap-1.5 text-xs text-[var(--gray-400)]">
          <Link href="/" className="font-medium text-[var(--gray-600)] hover:text-black">
            {ROLE_LABELS[role]}
          </Link>
          <ChevronRight size={12} />
          <span>{section}</span>
        </nav>
        <h1 className="console-title mt-2">{title}</h1>
        {description && <p className="console-lede">{description}</p>}
      </div>
      {action && <div className="w-full sm:w-auto sm:min-w-[20rem]">{action}</div>}
    </div>
  )
}
