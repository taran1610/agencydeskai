import { Database, Sparkles, UserCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Intake',
    body: 'Automatically extract and classify documents with high accuracy.',
  },
  {
    icon: UserCheck,
    title: 'Human-in-the-Loop',
    body: 'Review with confidence scores and smart suggestions.',
  },
  {
    icon: Database,
    title: 'CRM-Ready Export',
    body: 'Analyze, flag, and export clean data to your CRM.',
  },
] as const

export function LoginMarketingPanel() {
  return (
    <aside className="login-marketing">
      <p className="login-marketing__badge">Operations console</p>
      <h1 className="login-marketing__title">Welcome back</h1>
      <p className="login-marketing__lede">
        The all-in-one AI operations console for insurance agencies.
      </p>

      <ul className="login-marketing__features">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <li key={title} className="login-marketing__feature">
            <span className="login-marketing__feature-icon">
              <Icon size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="login-marketing__feature-title">{title}</p>
              <p className="login-marketing__feature-body">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
