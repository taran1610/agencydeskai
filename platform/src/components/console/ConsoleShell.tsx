import type { AuthContext } from '@/lib/auth/session'
import { ConsoleSidebar } from '@/components/console/ConsoleSidebar'
import { ConsoleTopBar } from '@/components/console/ConsoleTopBar'

export function ConsoleShell({
  auth,
  displayName,
  hasAiKey,
  children,
}: {
  auth: AuthContext
  displayName: string | null
  hasAiKey: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--gray-50)]">
      <ConsoleSidebar
        email={auth.email}
        role={auth.role}
        displayName={displayName}
        hasAiKey={hasAiKey}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ConsoleTopBar email={auth.email} role={auth.role} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
