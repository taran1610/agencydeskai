import { Bot, Sparkles, User } from 'lucide-react'
import type { DashboardActivity } from '@/lib/data'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const ACTOR_ICON = {
  ai: Sparkles,
  human: User,
  system: Bot,
} as const

export function RecentActivity({ items }: { items: DashboardActivity[] }) {
  return (
    <section className="dash-card">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-sm font-semibold text-black">Recent activity</h2>
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-xs text-[var(--gray-400)]">
          Activity will appear here as you work with accounts.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {items.map((item) => {
            const Icon = ACTOR_ICON[item.actor] ?? Bot
            return (
              <li key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gray-100)]">
                  <Icon size={14} className="text-[var(--gray-600)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-black">{item.title}</p>
                  {item.detail && (
                    <p className="truncate text-xs text-[var(--gray-500)]">{item.detail}</p>
                  )}
                </div>
                <span className="shrink-0 text-[11px] text-[var(--gray-400)]">
                  {timeAgo(item.created_at)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
