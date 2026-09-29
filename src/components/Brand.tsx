import { Link } from 'react-router-dom'

export function Brand({ to = '/' }: { to?: string }) {
  return (
    <Link className="brand" to={to} aria-label="AgencyDesk AI home">
      <svg className="brand__mark" width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="currentColor" />
        <path
          d="M9 8.5h9.2a2.8 2.8 0 0 1 2.8 2.8V23H12.2A3.2 3.2 0 0 1 9 19.8V8.5z"
          fill="#f4f1ea"
        />
        <path
          d="M13 14.2h6.2M13 17.4h6.2M13 20.6h3.6"
          stroke="#161513"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="22.2" cy="21.8" r="5.2" fill="#1c4f42" />
        <path
          d="M19.9 21.8l1.6 1.6 3-3.1"
          fill="none"
          stroke="#f4f1ea"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="brand__name">
        AgencyDesk
        <span className="brand__ai"> AI</span>
      </span>
    </Link>
  )
}
