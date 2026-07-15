export type PricingTier = {
  id: string
  name: string
  price: number
  currency: string
  period: string
  seatNote: string
  features: readonly string[]
  cta: {
    label: string
    href: string
    external?: boolean
  }
}

export const pricingIntro = {
  title: 'Priced for independent agencies.',
  description:
    'Plans built around how P&C brokers and agency ops teams actually work — predictable, monthly, no surprises.',
  footnote: 'Annual billing available · Pilot access for qualifying agencies',
}

export const pricingTiers: readonly PricingTier[] = [
  {
    id: 'solo',
    name: 'Solo',
    price: 299,
    currency: '$',
    period: '/mo',
    seatNote: '1 workspace',
    features: [
      'Up to 25 client accounts',
      'AI document intake & extraction',
      'Human review with confidence scores',
      'CRM-ready export blocks',
    ],
    cta: {
      label: 'Get started',
      href: 'billing',
    },
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 799,
    currency: '$',
    period: '/mo',
    seatNote: 'up to 5 users',
    features: [
      'Unlimited client accounts',
      'Shared team workspace',
      'Owner, reviewer & viewer roles',
      'Bulk approve & process-all',
      'Priority support',
    ],
    cta: {
      label: 'Get started',
      href: 'contact-agency',
    },
  },
  {
    id: 'multi-office',
    name: 'Multi-office',
    price: 1999,
    currency: '$',
    period: '/mo',
    seatNote: 'up to 20 users',
    features: [
      'Everything in Agency',
      'Advanced review workflows',
      'Custom AMS integrations',
      'Dedicated onboarding support',
    ],
    cta: {
      label: 'Get started',
      href: 'contact-multi',
    },
  },
] as const

export type PricingCtaKey = PricingTier['cta']['href']
