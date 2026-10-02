import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Database,
  FileCheck,
  FileSpreadsheet,
  Lock,
  Play,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import { AgencyRoiCalculator } from '../components/AgencyRoiCalculator'
import { PricingIntro, PricingTiers } from '../components/PricingTiers'
import { ProductConsolePreview } from '../components/ProductConsolePreview'
import { SeoHead } from '../components/SeoHead'
import { SiteFooter } from '../components/SiteFooter'
import { WaitlistForm } from '../components/WaitlistForm'
import { site } from '../config/site'
import { useScrolledPast } from '../hooks/useScrolledPast'

const metrics = [
  {
    value: '84%',
    label: 'Faster intake & triage',
    sub: 'From 45 minutes down to 6 minutes per commercial packet',
  },
  {
    value: '100%',
    label: 'Source page citations',
    sub: 'Every extracted limit, date, and name links to its source text',
  },
  {
    value: '0',
    label: 'Automatic AMS overwrites',
    sub: 'All proposed updates require explicit human verification',
  },
] as const

const documentTypes = [
  {
    code: 'ACORD 125',
    title: 'Commercial Application',
    desc: 'Named insured, FEIN, operations, premises, policy terms & prior carrier history.',
    badge: 'Core App',
  },
  {
    code: 'ACORD 126',
    title: 'Commercial General Liability',
    desc: 'Occurrence & aggregate limits, products/completed ops, subcontractor schedules.',
    badge: 'Coverage',
  },
  {
    code: 'ACORD 140',
    title: 'Commercial Property',
    desc: 'Statement of values (SOV), building & BPP limits, coinsurance, wind/hail deductibles.',
    badge: 'Property',
  },
  {
    code: 'Loss Runs',
    title: 'Carrier 3-5 Year Reports',
    desc: 'Travelers, Liberty Mutual, Hartford, Chubb, Progressive — paid, reserved, valuation dates.',
    badge: 'Underwriting',
  },
  {
    code: 'Policy Decs',
    title: 'Declarations & Schedules',
    desc: 'Expiring vs renewal terms, endorsement schedules, driver rosters, vehicle schedules.',
    badge: 'Verification',
  },
  {
    code: 'Certificates (COI)',
    title: 'Certificates of Insurance',
    desc: 'Additional insured endorsements, waiver of subrogation, 30-day notice verification.',
    badge: 'Compliance',
  },
] as const

const fourJobs = [
  {
    num: '01',
    icon: FileSpreadsheet,
    title: 'Read & classify complex packets',
    subtitle: 'From messy multi-document PDFs into a unified policy model',
    body:
      'Commercial clients don’t submit clean single-page forms. They send 45-page scanned PDFs mixing ACORD 125s, loss runs, carrier dec pages, and driver lists. AgencyDesk auto-splits, classifies document types, and extracts structured fields in seconds.',
    pill: 'Intake Automation',
  },
  {
    num: '02',
    icon: Sparkles,
    title: 'Condense & summarize the file',
    subtitle: 'Executive intelligence for producers and account managers',
    body:
      'Distills 40+ pages of policy legalese into an executive client briefing. Summarizes operations, premium history, 3-year loss ratios, and expiring coverage details so your account manager enters renewal meetings fully prepared.',
    pill: 'File Intelligence',
  },
  {
    num: '03',
    icon: AlertTriangle,
    title: 'Flag underwriting gaps & missing forms',
    subtitle: 'Catch compliance issues before underwriters reject submissions',
    body:
      'Flags stale loss runs (older than 30/60 days), missing driver schedules on auto fleets, expired alarm certificates, and policy number mismatches across documents before your team wastes submission turnaround cycles.',
    pill: 'Pre-Flight Audit',
  },
  {
    num: '04',
    icon: Database,
    title: 'Stage CRM & AMS-ready field updates',
    subtitle: 'Zero re-keying with 100% human sign-off',
    body:
      'Pre-stages formatted CRM update blocks citing the exact source page and excerpt. Ready to paste directly into Applied Epic, Vertafore AMS360, HawkSoft, or Salesforce — without giving an AI write access to your system of record.',
    pill: 'AMS Staging',
  },
] as const

const workflowSteps = [
  {
    step: '01',
    title: 'Upload the inbound client packet',
    body:
      'Drag and drop mixed PDF packets — ACORD applications, loss runs, dec pages, and supplemental schedules — all at once.',
  },
  {
    step: '02',
    title: 'AI OCR, classification & extraction',
    body:
      'Proprietary insurance-tuned models classify every document, extract crucial limits and dates, and score confidence.',
  },
  {
    step: '03',
    title: 'Underwriting gap & risk audit',
    body:
      'Cross-checks documents against each other. Automatically detects missing signatures, lapsed loss runs, and limit discrepancies.',
  },
  {
    step: '04',
    title: 'Account manager 1-click review',
    body:
      'Review fields side-by-side with source page citations. Bulk-approve high-confidence entries or edit in place.',
  },
  {
    step: '05',
    title: 'Export to AMS & lock the audit trail',
    body:
      'Copy the clean CRM block into your management system. Download audit-ready CSV or HTML reports for your compliance files.',
  },
] as const

const idealPersonas = [
  {
    title: 'Independent P&C Brokers',
    role: 'New Business & Renewals',
    body:
      'You handle dozens of renewals and submissions every month. Re-keying ACORD data and deciphering carrier loss runs eats entire mornings that should be spent closing clients.',
    highlight: 'Close submissions 3x faster',
  },
  {
    title: 'Agency Owners & Principals',
    role: 'Scale & Operations',
    body:
      'You want your account managers focused on client advisory and retention, not tedious manual data entry. Protect agency E&O with source-cited, audited workflow defaults.',
    highlight: 'Scale books without adding headcount',
  },
  {
    title: 'Operations & Account Managers',
    role: 'Daily File Preparation',
    body:
      'You prep renewal packets, chase missing driver schedules, and update CRM records. AgencyDesk hands you a clean, pre-verified file with every page cited.',
    highlight: 'Eliminate tedious copy-pasting',
  },
] as const

const securityPillars = [
  {
    icon: ShieldCheck,
    title: 'Zero Automated AMS Overwrites',
    body:
      'AgencyDesk AI never writes directly into your management system without human confirmation. Every proposed change is staged for review first.',
  },
  {
    icon: FileCheck,
    title: '100% Source-Level Citations',
    body:
      'Every extracted limit, date, and insured value cites its exact document, page number, and text excerpt so reviewers can verify in seconds.',
  },
  {
    icon: Lock,
    title: 'Bank-Grade PII Encryption',
    body:
      'All insurance records and tax IDs are encrypted at rest with AES-256 and in transit via TLS 1.3. We never train public foundation models on client documents.',
  },
  {
    icon: UserCheck,
    title: 'Granular Roles & Tamper-Evident Audit Logs',
    body:
      'Assign Owner, Reviewer, and Viewer permissions. Every file ingestion, field approval, and export is recorded with an immutable timestamp for E&O defense.',
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

      {/* FLOATING GLASS NAV */}
      <header className={`nav${navScrolled ? ' nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <Link className="brand" to="/#main-content" aria-label="AgencyDesk AI home">
            <span className="brand__logo-icon">
              <Shield size={18} strokeWidth={2.2} />
            </span>
            <div className="brand__text-group">
              <span className="brand__name">AgencyDesk AI</span>
              <span className="brand__badge">Ops Console</span>
            </div>
          </Link>

          <nav className="nav__links" aria-label="Page sections">
            <a href="#product-demo" className="nav__highlight-link">
              <Play size={12} fill="currentColor" />
              <span>Interactive Demo</span>
            </a>
            <a href="#features">The 4 Jobs</a>
            <a href="#documents">Document Types</a>
            <a href="#how-it-works">Workflow</a>
            <a href="#roi-calc">ROI Calculator</a>
            <a href="#pricing">Pricing</a>
            <a href="#trust">Security &amp; Trust</a>
          </nav>

          <div className="nav__actions">
            <a href={site.loginUrl} className="nav__signin">
              Sign in
            </a>
            <a href={site.loginUrl} className="nav__cta">
              <span>Launch console</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container">
            <div className="hero__content">
              {/* Eyebrow badge */}
              <div className="hero__eyebrow">
                <span className="hero__eyebrow-dot" />
                <span>Private Beta Live · Purpose-Built for Commercial P&amp;C Insurance Agencies</span>
              </div>

              {/* Main Headline */}
              <h1 id="hero-heading" className="hero__headline">
                The AI operations console for <em>commercial insurance brokers.</em>
              </h1>

              {/* Subtitle */}
              <p className="hero__sub">
                Reads complex ACORD packets, carrier loss runs, and dec pages in seconds. Classifies documents, extracts cited fields, catches coverage gaps, and stages CRM-ready updates — with mandatory human review before anything touches your AMS.
              </p>

              {/* Dual Action CTAs */}
              <div className="hero__actions">
                <a href={site.loginUrl} className="btn btn--primary">
                  <span>Launch console</span>
                  <ArrowRight size={16} />
                </a>
                <a href="#product-demo" className="btn btn--outline">
                  <Play size={15} fill="currentColor" />
                  <span>Explore interactive demo</span>
                </a>
                <a href="#beta" className="btn btn--ghost">
                  <span>Join private waitlist</span>
                </a>
              </div>

              {/* Hero Trust Strip */}
              <div className="hero__trust-strip">
                <div className="trust-strip-item">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>0 Automated AMS overwrites</span>
                </div>
                <div className="trust-strip-item">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>100% Source page citations</span>
                </div>
                <div className="trust-strip-item">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Applied Epic &amp; AMS360 compatible</span>
                </div>
                <div className="trust-strip-item">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>SOC-2 Type II ingestion readiness</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED: INTERACTIVE PRODUCT CONSOLE PREVIEW */}
        <section id="product-demo" className="demo-showcase-section">
          <div className="container">
            <div className="demo-section-head">
              <div className="demo-badge">
                <Sparkles size={13} />
                <span>LIVE PRODUCT PREVIEW · INTERACTIVE SANDBOX</span>
              </div>
              <h2 className="demo-title">
                Experience the AgencyDesk <em>operations console.</em>
              </h2>
              <p className="demo-sub">
                Select a commercial client file below to test the extraction engine, review citation sources, inspect underwriting risk flags, and copy staged CRM blocks.
              </p>
            </div>

            {/* The Interactive Preview Component with Live Dummy Data */}
            <ProductConsolePreview />
          </div>
        </section>

        {/* METRICS STRIP */}
        <section className="metrics" aria-label="Proven agency impact">
          <div className="container">
            <div className="metrics__grid">
              {metrics.map((m) => (
                <div key={m.label} className="metric">
                  <div className="metric__value">{m.value}</div>
                  <div className="metric__label">{m.label}</div>
                  <div className="metric__sub">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUPPORTED DOCUMENT TYPES STRIP */}
        <section id="documents" className="doc-strip-section">
          <div className="container">
            <div className="section-head">
              <p className="label">Full Ingestion Spectrum</p>
              <h2 className="section-head__title">
                Reads every commercial form, <em>PDF or scan.</em>
              </h2>
              <p className="section-head__sub">
                No need to manually split, rename, or re-type documents. AgencyDesk ingests multi-policy packets and extracts tabular data, schedules, and carrier notes directly.
              </p>
            </div>

            <div className="doc-strip__grid">
              {documentTypes.map((doc) => (
                <div key={doc.code} className="doc-type-card">
                  <div className="doc-type-card__header">
                    <span className="doc-code">{doc.code}</span>
                    <span className="doc-badge">{doc.badge}</span>
                  </div>
                  <h3 className="doc-title">{doc.title}</h3>
                  <p className="doc-desc">{doc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE FOUR JOBS */}
        <section id="features" className="features">
          <div className="container">
            <div className="section-head section-head--split">
              <div>
                <p className="label">Core Operations Intelligence</p>
                <h2 className="section-head__title">
                  The four back-office jobs —{' '}
                  <em>done by AI, verified by your team.</em>
                </h2>
              </div>
              <p className="section-head__aside label">Module 1.0 — Commercial P&amp;C</p>
            </div>

            <div className="four-jobs__grid">
              {fourJobs.map((job) => {
                const Icon = job.icon
                return (
                  <div key={job.num} className="job-card">
                    <div className="job-card__top">
                      <div className="job-card__icon-wrap">
                        <Icon size={22} className="text-slate-800" />
                      </div>
                      <span className="job-card__num">{job.num}</span>
                    </div>

                    <span className="job-card__pill">{job.pill}</span>
                    <h3 className="job-card__title">{job.title}</h3>
                    <p className="job-card__subtitle">{job.subtitle}</p>
                    <p className="job-card__body">{job.body}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / 5-STEP WORKFLOW */}
        <section id="how-it-works" className="how-it-works">
          <div className="container">
            <div className="section-head">
              <p className="label">The Operations Pipeline</p>
              <h2 className="section-head__title">
                From inbound packet to CRM-ready in <em>minutes.</em>
              </h2>
              <p className="section-head__sub">
                Designed to fit directly into your agency&rsquo;s existing workflow. No complex AMS migration, no API headaches, and zero blind automation.
              </p>
            </div>

            <div className="workflow-steps__grid">
              {workflowSteps.map((step) => (
                <div key={step.step} className="step-card">
                  <span className="step-card__num">STEP {step.step}</span>
                  <h3 className="step-card__title">{step.title}</h3>
                  <p className="step-card__body">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTERACTIVE ROI / TIME SAVED CALCULATOR */}
        <section id="roi-calc" className="roi-section">
          <div className="container">
            <AgencyRoiCalculator />
          </div>
        </section>

        {/* BUILT FOR BROKERS & AGENCIES */}
        <section id="for-brokers" className="for-brokers">
          <div className="container">
            <div className="section-head">
              <p className="label">Built For P&amp;C Teams</p>
              <h2 className="section-head__title">
                Designed for how commercial agencies <em>actually work.</em>
              </h2>
            </div>

            <div className="personas__grid">
              {idealPersonas.map((persona) => (
                <div key={persona.title} className="persona-card">
                  <span className="persona-role">{persona.role}</span>
                  <h3 className="persona-title">{persona.title}</h3>
                  <p className="persona-body">{persona.body}</p>
                  <div className="persona-highlight">
                    <Check size={14} className="text-emerald-600" />
                    <span>{persona.highlight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST & SECURITY (E&O DEFENSE) */}
        <section id="trust" className="trust">
          <div className="container">
            <div className="trust__header">
              <p className="label">E&amp;O Defense &amp; Governance</p>
              <h2 className="trust__title">
                Every extracted answer must <em>show its paperwork.</em>
              </h2>
              <p className="trust__sub">
                Insurance operations require zero tolerance for hallucinations. AgencyDesk AI is architected from the ground up to protect your agency&rsquo;s E&amp;O coverage with tamper-proof audit trails.
              </p>
            </div>

            <div className="trust-pillars__grid">
              {securityPillars.map((p) => {
                const Icon = p.icon
                return (
                  <div key={p.title} className="trust-pillar-card">
                    <div className="trust-pillar-icon">
                      <Icon size={22} className="text-emerald-600" />
                    </div>
                    <h3 className="trust-pillar-title">{p.title}</h3>
                    <p className="trust-pillar-body">{p.body}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="pricing-section">
          <div className="container">
            <PricingIntro headingLevel="h2" />
            <PricingTiers />
          </div>
        </section>

        {/* BETA CTA PANEL */}
        <section id="beta" className="cta">
          <div className="container">
            <div className="cta__panel">
              <div className="cta__badge">
                <Sparkles size={14} />
                <span>PRIVATE BETA · 2026 COMMERCIAL COHORT</span>
              </div>
              <h2 className="cta__title">
                Join the first <em>agency</em> pilots.
              </h2>
              <p className="cta__sub">
                Accelerate renewal prep, eliminate re-keying errors, and reclaim 80+ hours of operational time every month.
              </p>
              <div className="cta__form-wrap">
                <WaitlistForm variant="final" withRole buttonLabel="Request pilot access" />
              </div>
              <p className="cta__legal">
                By requesting access you agree to our{' '}
                <Link to="/terms">Terms of Use</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>. We never share your data.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
