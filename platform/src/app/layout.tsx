import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { ConsoleShell } from '@/components/console/ConsoleShell'
import { getAuthContext } from '@/lib/auth/session'
import { getProfileDisplayName } from '@/lib/data'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-app',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif-login',
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
  const pathname = (await headers()).get('x-pathname') ?? ''
  const standaloneRoute = pathname === '/checkout' || pathname.startsWith('/checkout/')

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="h-full">
        {auth && !standaloneRoute ? (
          <ConsoleShell auth={auth} displayName={displayName} hasAiKey={hasAiKey}>
            {children}
          </ConsoleShell>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
