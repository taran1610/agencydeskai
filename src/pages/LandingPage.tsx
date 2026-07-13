import { Link } from 'react-router-dom'
import {
  ClipboardCheck,
  FileSearch,
  Flag,
  ShieldCheck,
  Sparkles,
  Eye,
  Link as LinkIcon,
  Lock,
  FileText,
  Users,
  Building2,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Database,
  Upload,
} from 'lucide-react'
import { HeroMotionFallback } from '../components/HeroMotionFallback'
import { HeroPlayer } from '../components/HeroPlayer'
import { WaitlistForm } from '../components/WaitlistForm'
import { SeoHead } from '../components/SeoHead'
import { ShareOnX } from '../components/ShareOnX'
import { SiteFooter } from '../components/SiteFooter'
import { site } from '../config/site'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useScrolledPast } from '../hooks/useScrolledPast'

const workflow = [
  {
    icon: FileSearch,
    accent: '#d8dee8',
    title: 'Read the packet',
    body:
      'Classify ACORDs, loss runs, dec pages, schedules, and supplementals. Pull values into a structured file.',
  },
  {
    icon: Sparkles,
    accent: '#b9c1cf',
    title: 'Summarize the file',
    body:
      'Condense the client file and the recent changes worth a producer or account manager’s attention.',
  },
  {
    icon: Flag,
    accent: '#a8b0bd',
    title: 'Flag missing work',
    body:
      'Detect missing signatures, forms, and inconsistent values across the packet before they reach your team.',
  },
  {
    icon: ClipboardCheck,
    accent: '#c8ced8',
    title: 'Prepare CRM updates',
    body:
      'Stage CRM and AMS field updates with the source page and excerpt attached to every proposed change.',
  },
] as const

const metrics = [
  {
    accent: '#d8dee8',
    value: '50%',
    label: 'target admin time reduction in pilot workflows',
  },
  {
    accent: '#b9c1cf',
    value: '4',
    label: 'core jobs: intake, summary, CRM prep, missing-form review',
  },
  {
    accent: '#a8b0bd',
    value: '0',
    label: 'automatic AMS changes without human approval',
  },
] as const

const features = [
  {
    icon: FileText,
    title: 'Reads every document type',
    body:
      'ACORD applications (125, 126, 140), loss runs, declarations pages, certificates of insurance, policy documents, endorsements, quotes, and correspondence — PDF or scanned.',
  },
  {
    icon: Sparkles,
    title: 'Classifies & extracts automatically',
    body:
      'The AI detects document type, pulls insured name, policy numbers, effective dates, limits, carriers, premiums, and claim history — each field with a confidence score and source citation.',
  },
  {
    icon: Flag,
    title: 'Flags what’s missing or wrong',
    body:
      'Missing loss runs, unsigned applications, expired certificates, mismatched policy numbers across documents — surfaced before your team wastes time.',
  },
  {
    icon: Database,
    title: 'Prepares CRM-ready updates',
    body:
      'Account summaries and suggested AMS field updates you can copy-paste. Nothing writes to your system of record until a human approves.',
  },
  {
    icon: Users,
    title: 'Team workspace with roles',
    body:
      'Owners, reviewers, and viewers. Invite your account managers and ops staff. Every action logged in an audit trail.',
  },
  {
    icon: ShieldCheck,
    title: 'Human-in-the-loop by default',
    body:
      'Approve, edit, or reject every extracted value. Bulk-approve high-confidence fields. Export CSV or HTML reports for your files.',
  },
] as const

const howItWorks = [
  { step: '01', title: 'Create a client account', body: 'One account per insured — your digital client file.' },
  { step: '02', title: 'Upload the packet', body: 'Drag and drop ACORDs, loss runs, dec pages, COIs. Multiple files at once.' },
  { step: '03', title: 'AI reads every document', body: 'Classification + field extraction with confidence scores and source notes.' },
  { step: '04', title: 'Your team reviews', body: 'Approve, edit, or reject each field. Bulk-approve fields above 90% confidence.' },
  { step: '05', title: 'Generate the account analysis', body: 'Summary, severity-ranked flags, CRM update block, and prioritized action items.' },
  { step: '06', title: 'Copy to your AMS or export', body: 'Paste the CRM block into your system. Export CSV extractions or an HTML report.' },
] as const

const idealCustomers = [
  {
    icon: Briefcase,
    title: 'Independent insurance brokers',
    body: 'You handle dozens of renewals and new business submissions. Intake eats your week.',
  },
  {
    icon: Building2,
    title: 'P&C agency owners',
    body: 'You want your team focused on clients and sales — not re-keying ACORD data into the AMS.',
  },
  {
    icon: Users,
    title: 'Operations & account managers',
    body: 'You prep renewal files, chase missing forms, and update CRM records before every meeting.',
  },
] as const

const trustBullets = [
  {
    icon: ShieldCheck,
    title: 'Human approval before CRM or AMS updates',
    body:
      'Every staged change waits for a person to confirm it. AgencyDesk AI never writes to your system of record on its own.',
  },
  {
    icon: LinkIcon,
    title: 'Source-linked fields for every extracted value',
    body:
      'Each value links back to the page, paragraph, and excerpt it came from — so reviewers can verify in seconds.',
  },
  {
    icon: Lock,
    title: 'Designed around sensitive insurance records',
    body:
      'Access controls, audit logs, and a paper trail on every action. Built for the way agencies actually handle PII.',
  },
] as const

export const LandingPage = () => {
  const reduceMotion = usePrefersReducedMotion()
  const navScrolled = useScrolledPast(48)

  return (
    <div className="page">
      <SeoHead />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className={`nav${navScrolled ? ' nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <Link className="brand" to="/#main-content" aria-label="AgencyDesk AI home">
            <span className="brand__mark" aria-hidden>
              <svg viewBox="0 0 32 32" width="28" height="28">
                <rect width="32" height="32" rx="7" fill="#0c1014" />
                <rect x="7" y="6" width="14" height="18" rx="1.6" fill="#e6eaf0" />
                <rect x="9" y="10" width="8" height="1.2" rx="0.6" fill="#0c1014" opacity="0.55" />
                <rect x="9" y="13" width="10" height="1.2" rx="0.6" fill="#0c1014" opacity="0.35" />
                <rect x="9" y="16" width="7" height="1.2" rx="0.6" fill="#0c1014" opacity="0.35" />
                <circle cx="23" cy="22" r="5" fill="#d8dee8" />
                <path d="M21 22l1.6 1.6L25 21.2" stroke="#0c1014" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <span className="brand__name">AgencyDesk AI</span>
          </Link>
          <nav className="nav__links" aria-label="Page sections">
            <a href="#features">What we do</a>
            <a href="#how-it-works">How it works</a>
            <a href="#for-brokers">Who it&rsquo;s for</a>
            <a href="#trust">Trust</a>
            <a href={site.appUrl} className="nav__signin">
              Sign in
            </a>
            <a href={site.appUrl} className="nav__cta">
              Launch console
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-heading">
          <div
            className="hero__animation"
            aria-hidden={reduceMotion ? undefined : true}
            role={reduceMotion ? 'img' : undefined}
            aria-label={
              reduceMotion
                ? 'Diagram: inbound insurance PDFs, an AI processor, and a human review queue with extracted fields.'
                : undefined
            }
          >
            <div className="hero__animation-inner">
              <HeroMotionFallback />
              <div className="hero__remotion-layer">
                <HeroPlayer reduceMotion={reduceMotion} />
              </div>
            </div>
            <div className="hero__animation-veil" />
          </div>

          <div className="hero__content">
            <div className="container hero__grid">
              <div className="hero__copy">
                <div className="eyebrow">
                  <span className="eyebrow__dot" aria-hidden />
                  AI operations for insurance brokers
                </div>
                <h1 id="hero-heading" className="hero__headline">
                  AgencyDesk <span className="accent-teal">AI</span>
                </h1>
                <p className="hero__sub">
                  AI that does insurance operations work for brokers. Reads ACORDs,
                  loss runs, and dec pages, summarizes client files, prepares CRM
                  updates, and flags missing forms — so brokers can manage more
                  clients with less manual work.
                </p>
                <div className="hero__actions">
                  <a href={site.appUrl} className="hero__cta-primary">
                    Launch console <ArrowRight size={16} aria-hidden />
                  </a>
                  <a href="#beta" className="hero__cta-secondary">
                    Join waitlist
                  </a>
                </div>
                <div className="hero__form-wrap">
                  <WaitlistForm
                    variant="hero"
                    buttonLabel="Join beta"
                  />
                  <div className="hero__form-note">
                    <Eye size={14} strokeWidth={2} aria-hidden />
                    Private beta · no AMS write access until you approve. Questions?{' '}
                    <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
                  </div>
                  <ShareOnX />
                </div>
              </div>
            </div>
          </div>

          <div className="hero__scroll" aria-hidden>
            <span />
          </div>
        </section>

        {/* METRICS */}
        <section className="metrics" aria-label="What pilots are aiming for">
          <div className="container metrics__grid">
            {metrics.map((m) => (
              <div key={m.label} className="metric">
                <div
                  className="metric__rule"
                  style={{ background: m.accent }}
                  aria-hidden
                />
                <div className="metric__value">{m.value}</div>
                <div className="metric__label">{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT WE DO */}
        <section id="features" className="features">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow eyebrow--dark">
                <span className="eyebrow__dot" aria-hidden />
                What AgencyDesk does
              </div>
              <h2 className="section-head__title">
                Insurance operations work — done by AI, reviewed by your team.
              </h2>
              <p className="section-head__sub">
                Not a generic document chatbot. AgencyDesk is built for the repetitive
                back-office jobs brokers and agencies do every day: reading packets,
                updating client files, and catching what&rsquo;s missing before renewal season.
              </p>
            </div>
            <ul className="features__grid">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <li key={f.title} className="feature-card">
                    <span className="feature-card__icon" aria-hidden>
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <h3 className="feature-card__title">{f.title}</h3>
                    <p className="feature-card__body">{f.body}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* WORKFLOW */}
        <section id="workflow" className="workflow">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow eyebrow--dark">
                <span className="eyebrow__dot" aria-hidden />
                The four jobs
              </div>
              <h2 className="section-head__title">
                Quiet work that happens before the renewal meeting.
              </h2>
              <p className="section-head__sub">
                AgencyDesk AI is not a chatbot bolted onto your AMS. It runs the
                back-office jobs that consume your account managers&rsquo; mornings —
                and hands a tidy, source-linked file to a human.
              </p>
            </div>

            <ol className="workflow__grid">
              {workflow.map((step, i) => {
                const Icon = step.icon
                return (
                  <li key={step.title} className="workflow-card">
                    <div className="workflow-card__head">
                      <span
                        className="workflow-card__icon"
                        style={{ color: step.accent }}
                      >
                        <Icon size={22} strokeWidth={1.8} aria-hidden />
                      </span>
                      <span className="workflow-card__step">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="workflow-card__title">{step.title}</h3>
                    <p className="workflow-card__body">{step.body}</p>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="how-it-works">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">
                <span className="eyebrow__dot" aria-hidden />
                How it works
              </div>
              <h2 className="section-head__title section-head__title--light">
                From upload to CRM-ready output in one workflow.
              </h2>
              <p className="section-head__sub section-head__sub--light">
                Sign in with Google, Apple, or email. Create your workspace, invite your
                team, and process your first client file in minutes.
              </p>
            </div>
            <ol className="how__grid">
              {howItWorks.map((item) => (
                <li key={item.step} className="how-card">
                  <span className="how-card__step">{item.step}</span>
                  <h3 className="how-card__title">{item.title}</h3>
                  <p className="how-card__body">{item.body}</p>
                </li>
              ))}
            </ol>
            <div className="how__cta">
              <a href={site.appUrl} className="how__cta-btn">
                <Upload size={18} aria-hidden /> Open the operations console
              </a>
            </div>
          </div>
        </section>

        {/* IDEAL CUSTOMER */}
        <section id="for-brokers" className="for-brokers">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow eyebrow--dark">
                <span className="eyebrow__dot" aria-hidden />
                Built for brokers &amp; agencies
              </div>
              <h2 className="section-head__title">
                If paperwork slows you down, this is for you.
              </h2>
            </div>
            <ul className="for-brokers__grid">
              {idealCustomers.map((c) => {
                const Icon = c.icon
                return (
                  <li key={c.title} className="broker-card">
                    <span className="broker-card__icon" aria-hidden>
                      <Icon size={24} strokeWidth={1.8} />
                    </span>
                    <h3 className="broker-card__title">{c.title}</h3>
                    <p className="broker-card__body">{c.body}</p>
                  </li>
                )
              })}
            </ul>
            <ul className="for-brokers__checks">
              {[
                'Processes ACORDs, loss runs, dec pages, and COIs',
                'Summarizes entire client files for renewal prep',
                'Flags missing signatures, forms, and inconsistent data',
                'Prepares copy-paste CRM updates with source citations',
                'Sign in with Google, Apple, or email — team invites included',
              ].map((text) => (
                <li key={text}>
                  <CheckCircle2 size={16} aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* TRUST */}
        <section id="trust" className="trust">
          <div className="container trust__grid">
            <div className="trust__lede">
              <div className="eyebrow">
                <span className="eyebrow__dot" aria-hidden />
                Trust by default
              </div>
              <h2 className="trust__title">
                Every answer should show its{' '}
                <span className="accent-coral">paperwork.</span>
              </h2>
              <p className="trust__sub">
                We built AgencyDesk AI for agencies that take E&amp;O seriously.
                The defaults err on the side of asking a human, citing a page,
                and leaving an audit trail.
              </p>
            </div>

            <ul className="trust__list">
              {trustBullets.map((b) => {
                const Icon = b.icon
                return (
                  <li key={b.title} className="trust-item">
                    <span className="trust-item__icon" aria-hidden>
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <div>
                      <div className="trust-item__title">{b.title}</div>
                      <p className="trust-item__body">{b.body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="beta" className="cta">
          <div className="container cta__inner">
            <div className="eyebrow eyebrow--on-dark">
              <span className="eyebrow__dot" aria-hidden />
              Private beta · limited cohort
            </div>
            <h2 className="cta__title">Join the first agency pilots.</h2>
            <p className="cta__sub">
              We are looking for brokers and agencies that want faster intake and renewal
              prep without giving up human review — or{' '}
              <a href={site.appUrl} className="cta__link">
                launch the console now
              </a>{' '}
              if you already have access.
            </p>
            <div className="cta__form-wrap">
              <WaitlistForm
                variant="final"
                withRole
                buttonLabel="Request access"
              />
            </div>
            <div className="cta__legal">
              We&rsquo;ll only use your email to talk to you about the pilot.{' '}
              <Link to="/privacy">Privacy policy</Link>
              {' · '}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
