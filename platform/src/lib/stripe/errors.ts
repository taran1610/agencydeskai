export function friendlyStripeError(message: string) {
  if (/no such price/i.test(message)) {
    return 'Billing is misconfigured (invalid Stripe price). Contact support.'
  }
  if (/no such customer/i.test(message)) {
    return 'Your billing profile was reset. Try subscribing again.'
  }
  if (/head office address/i.test(message) || /automatic tax/i.test(message)) {
    return 'Tax is not configured yet. Checkout will proceed without automatic tax — contact support if this persists.'
  }
  return message
}
