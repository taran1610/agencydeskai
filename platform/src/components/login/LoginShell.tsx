import type { ReactNode } from 'react'
import { Bot, CircleHelp } from 'lucide-react'
import { MarketingSiteLink } from '@/components/MarketingSiteLink'
import { LoginMarketingPanel } from '@/components/login/LoginMarketingPanel'

const HELP_EMAIL = 'liber1821@gmail.com'

export function LoginShell({ children }: { children: ReactNode }) {
  return (
    <div className="login-page">
      <div className="login-page__wave" aria-hidden />

      <header className="login-page__header">
        <MarketingSiteLink className="login-page__brand">
          <span className="login-page__logo">
            <Bot size={20} strokeWidth={2} />
          </span>
          <span className="login-page__brand-name">AgencyDesk AI</span>
        </MarketingSiteLink>
        <p className="login-page__header-tag">Operations console</p>
        <a href={`mailto:${HELP_EMAIL}`} className="login-page__help">
          Need help?
          <span className="login-page__help-icon">
            <CircleHelp size={16} strokeWidth={2} />
          </span>
        </a>
      </header>

      <div className="login-page__grid">
        <LoginMarketingPanel />
        <div className="login-page__card-wrap">
          <div className="login-page__card">{children}</div>
        </div>
      </div>
    </div>
  )
}
