import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { getMarketingSiteUrl } from '@/lib/marketing-site'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
}

/** Link to the public marketing site (opens in same tab). */
export function MarketingSiteLink({ children, className, ...rest }: Props) {
  return (
    <a
      href={getMarketingSiteUrl()}
      className={className}
      aria-label="AgencyDesk AI — marketing site"
      {...rest}
    >
      {children}
    </a>
  )
}
