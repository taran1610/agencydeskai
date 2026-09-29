import { Link } from 'react-router-dom'
import { ProductStage } from '../components/ProductStage'
import { PricingIntro, PricingTiers } from '../components/PricingTiers'
import { SeoHead } from '../components/SeoHead'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { WaitlistForm } from '../components/WaitlistForm'

const nav = [
  { href: '#product', label: 'Product' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#for-brokers', label: 'Who it’s for' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#trust', label: 'Trust' },
] as const

const assurances = [
  'Cited to the source page',
  'A person approves every update',
  'Audit trail on every action',
] as const

const features = [
  {
    num: '01',
    title: 'Reads the documents agencies actually get',
    body: 'ACORD applications (125, 126, 140), loss runs, declarations pages, certificates, policies, endorsements, quotes, and correspondence — PDF or scanned.',
  },
  {
    num: '02',
    title: 'Classifies and extracts with a source',
    body: 'Detects the document type and pulls insured name, policy numbers, effective dates, limits, carriers, premiums, and claim history. Each field keeps a confidence score and a source citation.',
  },
  {
    num: '03',
    title: 'Flags what is missing or inconsistent',
    body: 'Missing loss runs, unsigned applications, expired certificates, and policy numbers that do not match across the packet — surfaced before the team spends the morning on them.',
  },
  {
    num: '04',
    title: 'Prepares the CRM update, then stops',
    body: 'Account summaries and suggested AMS field updates your team can copy. Nothing is written to the system of record until a person approves it.',
  },
  {
    num: '05',
    title: 'A workspace with roles',
    body: 'Owners, reviewers, and viewers. Invite account managers and operations staff. Every action is written to an audit trail.',
  },
  {
    num: '06',
    title: 'Review stays in the loop',
    body: 'Approve, edit, or reject every extracted value. Bulk-approve high-confidence fields. Export a CSV or an HTML report for the file.',
  },
] as const

const howItWorks = [
  {
    step: '01',
    title: 'Create a client account',
    body: 'One account per insured — the digital client file.',
  },
  {
    step: '02',
    title: 'Upload the packet',
    body: 'ACORDs, loss runs, dec pages, and COIs. Several files at once.',
  },
  {
    step: '03',
    title: 'Read every document',
    body: 'Classification and field extraction, with confidence scores and source notes.',
  },
  {
    step: '04',
    title: 'Your team reviews',
    body: 'Approve, edit, or reject each field. Bulk-approve fields above 90% confidence.',
  },
  {
    step: '05',
    title: 'Generate the analysis',
    body: 'A summary, severity-ranked flags, a CRM update block, and prioritized actions.',
  },
  {
    step: '06',
    title: 'Copy to the AMS or export',
    body: 'Paste the CRM block into your system, or export CSV extractions and an HTML report.',
  },
] as const

const idealCustomers = [
  {
    title: 'Independent brokers',
    body: 'You handle dozens of renewals and new-business submissions. Intake eats the week.',
  },
  {
    title: 'P&C agency owners',
    body: 'You want the team on clients and sales, not re-keying ACORD data into the AMS.',
  },
  {
    title: 'Operations and account managers',
    body: 'You prep renewal files, chase missing forms, and update CRM records before the meeting.',
  },
] as const

const brokerChecks = [
  'Processes ACORDs, loss runs, dec pages, and COIs',
  'Summarizes a client file for renewal prep',
  'Flags missing signatures, forms, and inconsistent data',
  'Prepares copy-paste CRM updates with source citations',
  'Sign in with Google, Apple, or email — team invites included',
  'Every extracted field cites its page and excerpt',
] as const

const trustBullets = [
  {
    title: 'Human approval before CRM or AMS updates',
    body: 'Every staged change waits for a person to confirm it. AgencyDesk never writes to your system of record on its own.',
  },
  {
    title: 'Source-linked fields',
    body: 'Each value links back to the page and excerpt it came from, so a reviewer can check it in seconds.',
  },
  {
    title: 'Built around sensitive insurance records',
    body: 'Access controls, audit logs, and a paper trail on every action. Designed for the way agencies handle client information.',
  },
] as const

export const LandingPage = () => {
  return (
    <div className="page">
      <SeoHead />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader links={nav} ctaHref="#pilot" />

      <main id="main-content" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container hero__copy">
            <p className="eyebrow">For insurance agencies and brokers</p>
            <h1 id="hero-heading">Turn renewal packets into cited AMS updates.</h1>
            <p className="hero__sub">
              AgencyDesk reads ACORD applications, multi-year loss runs, and declaration
              pages. It pulls the fields your team would re-key, keeps the source page on
              each one, and prepares a CRM update a person approves before it is copied
              into the AMS.
            </p>
            <div className="hero__actions">
              <a href="#pilot" className="btn btn--primary">
                Request pilot access
                <Arrow />
              </a>
              <a href="#product" className="btn btn--ghost">
                See the product
              </a>
            </div>
            <ul className="trust-row">
              {assurances.map((item) => (
                <li key={item}>
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="product" className="demo" aria-label="Product demonstration">
          <div className="container">
            <ProductStage />
          </div>
        </section>

        <section id="capabilities" className="features">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">What AgencyDesk does</p>
              <h2>Insurance operations work, reviewed by your team.</h2>
              <p className="section-head__sub">
                Not a chatbot bolted onto the AMS. It runs the intake work that fills an
                account manager’s morning, then hands over a source-linked file.
              </p>
            </div>
            <ul className="features__grid">
              {features.map((feature) => (
                <li key={feature.num} className="feature-card">
                  <span className="feature-card__num">{feature.num}</span>
                  <h3 className="feature-card__title">{feature.title}</h3>
                  <p className="feature-card__body">{feature.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="how-it-works" className="how-it-works">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">How it works</p>
              <h2>From the upload to a CRM update, in one workflow.</h2>
              <p className="section-head__sub">
                Sign in with Google, Apple, or email. Create the workspace, invite the
                team, and process the first client file with a person still in the loop.
              </p>
            </div>
            <ol className="steps">
              {howItWorks.map((item) => (
                <li key={item.step} className="step">
                  <span className="step__n">{item.step}</span>
                  <h3 className="step__title">{item.title}</h3>
                  <p className="step__body">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="for-brokers" className="for-brokers">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Who it’s for</p>
              <h2>Built for the desk that preps the file.</h2>
            </div>
            <ul className="audience">
              {idealCustomers.map((customer) => (
                <li key={customer.title} className="audience__card">
                  <h3>{customer.title}</h3>
                  <p>{customer.body}</p>
                </li>
              ))}
            </ul>
            <ul className="checks">
              {brokerChecks.map((text) => (
                <li key={text}>
                  <Check />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="trust" className="trust">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Trust</p>
              <h2>Show the page behind every field.</h2>
              <p className="section-head__sub">
                Built for agencies that take E&amp;O seriously. The defaults ask a person,
                cite a page, and leave an audit trail.
              </p>
            </div>
            <ul className="trust-list">
              {trustBullets.map((item) => (
                <li key={item.title} className="trust-item">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="pricing" className="pricing-section">
          <div className="container">
            <PricingIntro headingLevel="h2" />
            <PricingTiers />
          </div>
        </section>

        <section id="pilot" className="cta">
          <div className="container">
            <div className="cta__panel">
              <p className="eyebrow eyebrow--on-dark">Private beta</p>
              <h2>Request a pilot for your agency.</h2>
              <p className="cta__sub">
                For brokers and agencies that want faster intake and renewal prep, without
                giving up human review.
              </p>
              <div className="cta__form-wrap">
                <WaitlistForm variant="final" withRole buttonLabel="Request pilot access" />
              </div>
              <p className="cta__legal">
                By requesting access you agree to our <Link to="/terms">Terms of Use</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>. We’ll only use your email about the
                pilot.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Check() {
  return (
    <svg className="check" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" />
      <path d="M5 8.2l2 2 4-4.2" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
