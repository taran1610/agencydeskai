import { redirect } from 'next/navigation'

/** Integrations page removed — settings covers AI/billing status. */
export default function IntegrationsPage() {
  redirect('/settings')
}
