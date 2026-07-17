import { APP_URL, MARKETING_URL } from '@/lib/email/client'

const brand = {
  name: 'AgencyDesk AI',
  ink: '#111111',
  cream: '#f4f1ea',
  muted: '#6b6560',
}

function layout(options: { preview: string; title: string; bodyHtml: string }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${options.title}</title>
</head>
<body style="margin:0;padding:0;background:${brand.cream};font-family:Georgia,'Times New Roman',serif;color:${brand.ink};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${options.preview}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${brand.cream};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid rgba(17,17,17,0.12);">
          <tr>
            <td style="padding:28px 28px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${brand.muted};">
              ${brand.name}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;">
              ${options.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;line-height:1.55;color:${brand.muted};border-top:1px solid rgba(17,17,17,0.08);padding-top:20px;">
              Questions? Just reply to this email — we read every message.<br/>
              <a href="${MARKETING_URL}" style="color:${brand.ink};">${MARKETING_URL.replace(/^https?:\/\//, '')}</a>
              ·
              <a href="${APP_URL}" style="color:${brand.ink};">Open console</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function cta(href: string, label: string) {
  return `<p style="margin:24px 0 0;">
    <a href="${href}" style="display:inline-block;background:${brand.ink};color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;font-weight:600;">
      ${label}
    </a>
  </p>`
}

export function welcomeEmailHtml(options: { name?: string | null }) {
  const greeting = options.name?.trim() ? `Hi ${options.name.trim()},` : 'Hi there,'
  return layout({
    preview: 'Thanks for trying AgencyDesk AI — we are glad you are here.',
    title: `Welcome to ${brand.name}`,
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:28px;line-height:1.25;font-weight:600;">Thanks for joining us</h1>
      <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:${brand.ink};">
        ${greeting}
      </p>
      <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:${brand.ink};">
        We really appreciate you giving ${brand.name} a try. Our goal is simple: help your agency
        move client paperwork faster without losing human review.
      </p>
      <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:${brand.ink};">
        Upload a packet, run extraction, review fields, then export a CRM-ready summary.
        If anything feels off, reply to this email — we want to hear from early customers.
      </p>
      ${cta(APP_URL, 'Open your workspace')}
    `,
  })
}

export function purchaseEmailHtml(options: {
  name?: string | null
  planLabel?: string | null
}) {
  const greeting = options.name?.trim() ? `Hi ${options.name.trim()},` : 'Hi there,'
  const plan = options.planLabel?.trim() || 'AgencyDesk Pro'
  return layout({
    preview: `Thanks for subscribing to ${plan}. We are excited to have you.`,
    title: `Thanks for your subscription — ${brand.name}`,
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:28px;line-height:1.25;font-weight:600;">Thank you for subscribing</h1>
      <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:${brand.ink};">
        ${greeting}
      </p>
      <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:${brand.ink};">
        Your <strong>${plan}</strong> subscription is active. We are grateful you chose us —
        supporting early agencies like yours is exactly why we built this.
      </p>
      <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:${brand.ink};">
        We will email you when we ship meaningful updates or fix issues that affect your workflow.
        You can manage billing anytime from the console.
      </p>
      ${cta(`${APP_URL}/billing`, 'Manage billing')}
      ${cta(APP_URL, 'Go to dashboard')}
    `,
  })
}

export function waitlistEmailHtml() {
  return layout({
    preview: 'Thanks for joining the AgencyDesk AI waitlist.',
    title: `You are on the list — ${brand.name}`,
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:28px;line-height:1.25;font-weight:600;">Thanks for your interest</h1>
      <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:${brand.ink};">
        Hi there,
      </p>
      <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:${brand.ink};">
        Thanks for joining the ${brand.name} waitlist. We appreciate agencies that want better
        intake and renewal prep without giving up human review.
      </p>
      <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.65;color:${brand.ink};">
        We will reach out with pilot access and product updates. In the meantime, you can create
        an account and explore the console anytime.
      </p>
      ${cta(`${APP_URL}/login`, 'Create your account')}
    `,
  })
}
