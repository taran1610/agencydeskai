import { LegalPageShell } from '../components/LegalPageShell'
import { site } from '../config/site'

const UPDATED = 'July 17, 2026'

export const PrivacyPage = () => (
  <LegalPageShell
    title={`Privacy Policy — ${site.name}`}
    description={`How ${site.name} collects, uses, stores, and shares personal and business data for the marketing site and operations console.`}
    path="/privacy"
    heading="Privacy Policy"
    updated={UPDATED}
  >
    <section>
      <h2>1. Who we are</h2>
      <p>
        {site.name} (&ldquo;AgencyDesk,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;) provides AI-assisted insurance operations software for
        agencies and brokers. This Privacy Policy explains how we handle information
        when you visit our marketing website, join a waitlist, create an account, or
        use the operations console.
      </p>
      <p>
        Controller / operator contact:{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
    </section>

    <section>
      <h2>2. Scope</h2>
      <p>This Policy covers:</p>
      <ul>
        <li>Our public marketing site ({site.url})</li>
        <li>Our operations console ({site.appUrl})</li>
        <li>Related emails, waitlist forms, billing, and support communications</li>
      </ul>
      <p>
        It does not cover third-party websites or services that we do not control,
        including your agency management system (AMS), email provider, or carriers.
      </p>
    </section>

    <section>
      <h2>3. Information we collect</h2>
      <h3>3.1 Account and contact information</h3>
      <ul>
        <li>Name, work email, and agency / workspace name</li>
        <li>Authentication data (including Google sign-in identifiers if you use OAuth)</li>
        <li>Role within a workspace (owner, reviewer, viewer)</li>
        <li>Waitlist or pilot signup details (email, optional role, form source, timestamp)</li>
      </ul>
      <h3>3.2 Customer content (your agency data)</h3>
      <ul>
        <li>
          Client account names and related metadata you create in the console
        </li>
        <li>
          Documents you upload (for example ACORD applications, loss runs, declarations
          pages, certificates, policies, correspondence) and derived extractions,
          analyses, flags, suggested CRM updates, exports, and audit logs
        </li>
      </ul>
      <h3>3.3 Payment and billing information</h3>
      <p>
        Subscription payments are processed by Stripe. We receive billing status,
        customer and subscription identifiers, and limited invoice metadata. We do not
        store full payment card numbers on our servers. Card data is handled by Stripe
        under its own terms and privacy policy.
      </p>
      <h3>3.4 Usage and technical data</h3>
      <ul>
        <li>Log data such as IP address, browser type, device, timestamps, and pages viewed</li>
        <li>Product usage events needed to operate the service (uploads, processing, reviews)</li>
        <li>
          Optional privacy-friendly analytics on the marketing site (for example Plausible),
          if enabled — without advertising trackers
        </li>
      </ul>
    </section>

    <section>
      <h2>4. How we use information</h2>
      <p>We use information to:</p>
      <ul>
        <li>Provide, maintain, secure, and improve the Service</li>
        <li>Authenticate users and manage workspaces, invitations, and roles</li>
        <li>
          Process documents with AI providers to classify content, extract fields, generate
          summaries/flags, and prepare export blocks (subject to human review workflows)
        </li>
        <li>Process subscriptions, invoices, taxes (if enabled), and customer support</li>
        <li>Send transactional messages (sign-in, invites, billing, security notices)</li>
        <li>Communicate about pilots, product updates, or waitlist status when you opt in</li>
        <li>Detect abuse, debug errors, and meet legal obligations</li>
      </ul>
      <p>We do not sell your personal information.</p>
    </section>

    <section>
      <h2>5. Legal bases (where applicable)</h2>
      <p>
        If you are in a jurisdiction that requires a legal basis for processing (for
        example the EEA/UK), we rely on one or more of: performance of a contract;
        legitimate interests (securing and improving the Service, preventing fraud);
        consent (where we ask for it); and legal obligation.
      </p>
    </section>

    <section>
      <h2>6. AI processing and subprocessors</h2>
      <p>
        To deliver document classification, extraction, and analysis, we send relevant
        content (including document files or extracted text) to AI model providers such as
        OpenAI and/or Anthropic, acting as processors on our behalf. Those providers process
        data under their terms and may process data in the United States or other countries.
      </p>
      <p>Other service providers we use to operate the Service may include:</p>
      <ul>
        <li>Supabase — authentication, database, and file storage</li>
        <li>Vercel — application hosting</li>
        <li>Stripe — payments and billing</li>
        <li>Email / OAuth identity providers you choose (for example Google)</li>
      </ul>
      <p>
        We require processors to protect data appropriately and use it only to provide
        services to us, except as required by law.
      </p>
    </section>

    <section>
      <h2>7. Sharing</h2>
      <p>We may share information:</p>
      <ul>
        <li>With subprocessors as needed to run the Service</li>
        <li>With your workspace teammates according to roles you configure</li>
        <li>
          If required by law, regulation, legal process, or to protect rights, safety, and
          security
        </li>
        <li>
          In connection with a merger, acquisition, financing, or sale of assets, subject to
          appropriate confidentiality protections
        </li>
        <li>With your direction or consent</li>
      </ul>
    </section>

    <section>
      <h2>8. International transfers</h2>
      <p>
        We and our providers may process data in Canada, the United States, and other
        countries. Where required, we use appropriate transfer mechanisms (such as standard
        contractual clauses) offered by our providers.
      </p>
    </section>

    <section>
      <h2>9. Retention</h2>
      <p>
        We retain account, workspace, document, and analysis data while your account is
        active and as needed to provide the Service. We may retain limited records after
        cancellation for backups, dispute resolution, security, and legal compliance. Waitlist
        emails are kept until the pilot ends or you request deletion. You may request
        deletion of your account data by contacting{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>; we will delete or
        anonymize personal data unless we must retain it by law.
      </p>
    </section>

    <section>
      <h2>10. Security</h2>
      <p>
        We use industry-standard safeguards appropriate to the nature of the data, including
        encrypted transport (HTTPS), access controls, and separation of service credentials.
        No method of transmission or storage is 100% secure. You are responsible for
        safeguarding your login credentials and for configuring teammate access carefully.
      </p>
    </section>

    <section>
      <h2>11. Your rights and choices</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete, or
        export personal data, object to or restrict certain processing, and withdraw consent
        where processing is consent-based. To exercise rights, email{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. We may need to verify
        your identity. Workspace owners can also manage teammate access and delete customer
        content in-product where available.
      </p>
      <p>
        If you use Google sign-in, you can revoke access via your Google account settings.
        Marketing emails (if any) include an unsubscribe option.
      </p>
    </section>

    <section>
      <h2>12. Cookies and similar technologies</h2>
      <p>
        We use essential cookies and similar storage for authentication sessions, security,
        and basic site operation. The marketing site may use local storage as a temporary
        backup for waitlist submissions. We do not use advertising cookies on the marketing
        site. You can control cookies through your browser settings; disabling essential
        cookies may prevent sign-in from working.
      </p>
    </section>

    <section>
      <h2>13. Children</h2>
      <p>
        The Service is designed for business users and is not directed to children under 16
        (or the minimum age required in your jurisdiction). We do not knowingly collect
        personal information from children.
      </p>
    </section>

    <section>
      <h2>14. Insurance and professional data</h2>
      <p>
        Documents you upload may contain sensitive commercial information about your clients.
        You represent that you have the right to upload and process that information in the
        Service, including any required notices or consents under applicable privacy and
        insurance regulations. We process that content to provide the Service to you as a
        business customer.
      </p>
    </section>

    <section>
      <h2>15. Changes</h2>
      <p>
        We may update this Policy from time to time. We will post the updated version with a
        new &ldquo;Last updated&rdquo; date. Material changes may also be communicated by
        email or in-product notice. Continued use after the effective date constitutes
        acceptance of the updated Policy where permitted by law.
      </p>
    </section>

    <section>
      <h2>16. Contact</h2>
      <p>
        Privacy requests and questions:{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
    </section>
  </LegalPageShell>
)
