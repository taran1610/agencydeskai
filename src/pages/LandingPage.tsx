import { Link } from 'react-router-dom'
import { HeroReviewCard } from '../components/HeroReviewCard'
import { WaitlistForm } from '../components/WaitlistForm'
import { SeoHead } from '../components/SeoHead'
import { SiteFooter } from '../components/SiteFooter'
import { site } from '../config/site'
import { useScrolledPast } from '../hooks/useScrolledPast'

const metrics = [
  { value: '50%', label: 'Target admin time reduction in pilot workflows' },
  { value: '4', label: 'Core jobs — intake, summary, CRM prep, missing-form review' },
  { value: '0', label: 'Automatic AMS changes without human approval' },
] as const

const features = [
  {
    num: '01',
    title: 'Reads every document type',
    body:
      'ACORD applications (125, 126, 140), loss runs, declarations pages, certificates of insurance, policy documents, endorsements, quotes, and correspondence — PDF or scanned.',
  },
  {
    num: '02',
    title: 'Classifies & extracts automatically',
    body:
      'Detects document type, pulls insured name, policy numbers, effective dates, limits, carriers, premiums, and claim history — each field with a confidence score and source citation.',
  },
  {
    num: '03',
    title: 'Flags what\u2019s missing or wrong',
    body:
      'Missing loss runs, unsigned applications, expired certificates, mismatched policy numbers across documents — surfaced before your team wastes time.',
  },
  {
    num: '04',
    title: 'Prepares CRM-ready updates',
    body:
      'Account summaries and suggested AMS field updates you can copy-paste. Nothing writes to your system of record until a human approves.',
  },
  {
    num: '05',
    title: 'Team workspace with roles',
    body:
      'Owners, reviewers, and viewers. Invite account managers and ops staff. Every action logged in an audit trail.',
    highlight: true,
  },
  {
    num: '06',
    title: 'Human-in-the-loop by default',
    body:
      'Approve, edit, or reject every extracted value. Bulk-approve high-confidence fields. Export CSV or HTML reports for your files.',
  },
] as const

const workflow = [
  {
    num: '01',
    title: 'Read the packet',
    body:
      'Classify ACORDs, loss runs, dec pages, schedules, and supplementals. Pull values into a structured file.',
  },
  {
    num: '02',
    title: 'Summarize the file',
    body:
      'Condense the client file and the recent changes worth a producer or account manager\u2019s attention.',
  },
  {
    num: '03',
    title: 'Flag missing work',
    body:
      'Detect missing signatures, forms, and inconsistent values across the packet before they reach your team.',
  },
  {
    num: '04',
    title: 'Prepare CRM updates',
    body:
      'Stage CRM and AMS field updates with the source page and excerpt attached to every proposed change.',
  },
] as const

const howItWorks = [
  { step: '01', title: 'Create a client account', body: 'One account per insured — your digital client file.' },
  { step: '02', title: 'Upload the packet', body: 'Drag and drop ACORDs, loss runs, dec pages, COIs. Multiple files at once.' },
  { step: '03', title: 'AI reads every document', body: 'Classification and field extraction with confidence scores and source notes.' },
  { step: '04', title: 'Your team reviews', body: 'Approve, edit, or reject each field. Bulk-approve fields above 90% confidence.' },
  { step: '05', title: 'Generate the account analysis', body: 'Summary, severity-ranked flags, CRM update block, and prioritized action items.' },
  { step: '06', title: 'Copy to your AMS or export', body: 'Paste the CRM block into your system. Export CSV extractions or an HTML report.' },
] as const

const idealCustomers = [
  {
    title: 'Independent insurance brokers',
    body: 'You handle dozens of renewals and new business submissions. Intake eats your week.',
  },
  {
    title: 'P&C agency owners',
    body: 'You want your team focused on clients and sales — not re-keying ACORD data into the AMS.',
  },
  {
    title: 'Operations & account managers',
    body: 'You prep renewal files, chase missing forms, and update CRM records before every meeting.',
  },
] as const

const brokerChecks = [
  'Processes ACORDs, loss runs, dec pages, and COIs',
  'Summarizes entire client files for renewal prep',
  'Flags missing signatures, forms, and inconsistent data',
  'Prepares copy-paste CRM updates with source citations',
  'Sign in with Google, Apple, or email — team invites included',
  'Every extracted field cites its page and excerpt',
] as const

const trustBullets = [
  {
    title: 'Human approval before CRM or AMS updates',
    body:
      'Every staged change waits for a person to confirm it. AgencyDesk AI never writes to your system of record on its own.',
  },
  {
    title: 'Source-linked fields for every extracted value',
    body:
      'Each value links back to the page, paragraph, and excerpt it came from — so reviewers can verify in seconds.',
  },
  {
    title: 'Designed around sensitive insurance records',
    body:
      'Access controls, audit logs, and a paper trail on every action. Built for the way agencies actually handle PII.',
  },
] as const

export const LandingPage = () => {
  const navScrolled = useScrolledPast(24)

  return (
    <div className="page">
      <SeoHead />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className={`nav${navScrolled ? ' nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <Link className="brand" to="/#main-content" aria-label="AgencyDesk AI home">
            <span className="brand__name">AgencyDesk AI</span>
          </Link>
          <nav className="nav__links" aria-label="Page sections">
            <a href="#features">What we do</a>
            <a href="#how-it-works">How it works</a>
            <a href="#for-brokers">Who it&rsquo;s for</a>
            <a href="#trust">Trust</a>
          </nav>
          <div className="nav__actions">
            <a href={site.loginUrl} className="nav__signin">
              Sign in
            </a>
            <a href={site.appUrl} className="nav__cta">
              Launch console
            </a>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container">
            <div className="hero__panel">
              <div className="hero__copy">
                <p className="label">AI operations for insurance brokers</p>
                <h1 id="hero-heading" className="hero__headline">
                  AI that does insurance operations work for brokers.
                </h1>
                <p className="hero__sub">
                  Reads ACORDs, loss runs, and dec pages. Summarizes client files,
                  prepares CRM updates, and flags missing forms — so brokers can manage
                  more clients with less manual work.
                </p>
                <div className="hero__actions">
                  <a href={site.appUrl} className="btn btn--primary">
                    Launch console
                  </a>
                  <a href="#beta" className="btn btn--outline">
                    Join waitlist
                  </a>
                </div>
              </div>
              <HeroReviewCard />
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section className="metrics" aria-label="What pilots are aiming for">
          <div className="container">
            <div className="metrics__grid">
              {metrics.map((m) => (
                <div key={m.label} className="metric">
                  <div className="metric__value">{m.value}</div>
                  <div className="metric__label">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section id="features" className="features">
          <div className="container">
            <div className="section-head section-head--split">
              <div>
                <p className="label">What AgencyDesk does</p>
                <h2 className="section-head__title">
                  Insurance operations work —{' '}
                  <em>done by AI, reviewed by your team.</em>
                </h2>
              </div>
              <p className="section-head__aside label">Module 1.0 — Ops intelligence</p>
            </div>
            <ul className="features__grid">
              {features.map((f) => (
                <li
                  key={f.num}
                  className={`feature-card${'highlight' in f && f.highlight ? ' feature-card--highlight' : ''}`}
                >
                  <span className="feature-card__num" aria-hidden>
                    {f.num}
                  </span>
                  <h3 className="feature-card__title">{f.title}</h3>
                  <p className="feature-card__body">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* THE FOUR JOBS */}
        <section id="workflow" className="workflow">
          <div className="container">
            <div className="section-head">
              <p className="label">The four jobs</p>
              <h2 className="section-head__title">
                Quiet work that happens before the <em>renewal</em> meeting.
              </h2>
              <p className="section-head__sub">
                AgencyDesk AI is not a chatbot bolted onto your AMS. It runs the
                back-office jobs that consume your account managers&rsquo; mornings —
                and hands a tidy, source-linked file to a human.
              </p>
            </div>
            <ol className="workflow__grid">
              {workflow.map((step) => (
                <li key={step.num} className="workflow-card">
                  <span className="workflow-card__num" aria-hidden>
                    {step.num}
                  </span>
                  <h3 className="workflow-card__title">{step.title}</h3>
                  <p className="workflow-card__body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="how-it-works">
          <div className="container">
            <div className="section-head">
              <p className="label">How it works</p>
              <h2 className="section-head__title">
                From upload to CRM-ready output in <em>one</em> workflow.
              </h2>
              <p className="section-head__sub">
                Sign in with Google, Apple, or email. Create your workspace, invite your
                team, and process your first client file in minutes.
              </p>
            </div>
            <ol className="how__grid">
              {howItWorks.map((item) => (
                <li key={item.step} className="how-card">
                  <span className="how-card__step">Step {item.step}</span>
                  <h3 className="how-card__title">{item.title}</h3>
                  <p className="how-card__body">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* BUILT FOR BROKERS */}
        <section id="for-brokers" className="for-brokers">
          <div className="container">
            <div className="section-head">
              <p className="label">Built for brokers &amp; agencies</p>
              <h2 className="section-head__title">
                If paperwork slows you down, <em>this is for you.</em>
              </h2>
            </div>
            <ul className="for-brokers__grid">
              {idealCustomers.map((c) => (
                <li key={c.title} className="broker-card">
                  <h3 className="broker-card__title">{c.title}</h3>
                  <p className="broker-card__body">{c.body}</p>
                </li>
              ))}
            </ul>
            <ul className="for-brokers__checks">
              {brokerChecks.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* TRUST */}
        <section id="trust" className="trust">
          <div className="container trust__grid">
            <div className="trust__lede">
              <p className="label">Trust by default</p>
              <h2 className="trust__title">
                Every answer should <em>show</em> its paperwork.
              </h2>
              <p className="trust__sub">
                We built AgencyDesk AI for agencies that take E&amp;O seriously.
                The defaults err on the side of asking a human, citing a page,
                and leaving an audit trail.
              </p>
            </div>
            <ul className="trust__list">
              {trustBullets.map((b) => (
                <li key={b.title} className="trust-item">
                  <h3 className="trust-item__title">{b.title}</h3>
                  <p className="trust-item__body">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* BETA CTA */}
        <section id="beta" className="cta">
          <div className="container">
            <div className="cta__panel">
              <p className="label label--on-dark">Private beta · limited cohort</p>
              <h2 className="cta__title">
                Join the first <em>agency</em> pilots.
              </h2>
              <p className="cta__sub">
                We&rsquo;re looking for brokers and agencies that want faster intake and
                renewal prep without giving up human review.
              </p>
              <div className="cta__form-wrap">
                <WaitlistForm variant="final" buttonLabel="Request access" />
              </div>
              <p className="cta__legal">
                We&rsquo;ll only use your email to talk to you about the pilot.{' '}
                <Link to="/privacy">Privacy policy</Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
