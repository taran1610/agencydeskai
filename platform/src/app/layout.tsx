import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { ConsoleShell } from '@/components/console/ConsoleShell'
import { getAuthContext } from '@/lib/auth/session'
import { getProfileDisplayName } from '@/lib/data'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-app',
})

export const metadata: Metadata = {
  title: 'AgencyDesk AI — Operations Console',
  description:
    'AI operations teammate for insurance agencies: document intake, extraction, flags, and CRM prep with human approval.',
}

function hasAiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY)
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const auth = await getAuthContext()
  const displayName = auth ? await getProfileDisplayName(auth.userId) : null
  const hasAiKey = hasAiConfigured()

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full">
        {auth ? (
          <ConsoleShell auth={auth} displayName={displayName} hasAiKey={hasAiKey}>
            {children}
          </ConsoleShell>
        ) : (
          <div className="flex min-h-full flex-col">
            <header className="border-b border-[var(--border)] bg-white">
              <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between px-6">
                <Link href="/login" className="text-sm font-semibold text-black">
                  AgencyDesk AI
                </Link>
                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gray-400)]">
                  Operations console
                </span>
              </div>
            </header>
            <main className="mx-auto w-full max-w-lg flex-1 px-6 py-10">{children}</main>
          </div>
        )}
      </body>
    </html>
  )
}
