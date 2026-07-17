import { LegalPageShell } from '../components/LegalPageShell'
import { site } from '../config/site'

const UPDATED = 'July 17, 2026'

export const TermsPage = () => (
  <LegalPageShell
    title={`Terms of Use — ${site.name}`}
    description={`Terms of Use for ${site.name}: accounts, subscriptions, acceptable use, AI limitations, liability, and governing law.`}
    path="/terms"
    heading="Terms of Use"
    updated={UPDATED}
  >
    <section>
      <h2>1. Agreement</h2>
      <p>
        These Terms of Use (&ldquo;Terms&rdquo;) are a binding agreement between you
        (&ldquo;Customer,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and {site.name}{' '}
        (&ldquo;AgencyDesk,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
        governing access to and use of our websites, applications, and related services
        (collectively, the &ldquo;Service&rdquo;).
      </p>
      <p>
        By accessing or using the Service, creating an account, clicking to accept, or
        completing a purchase, you agree to these Terms and our{' '}
        <a href="/privacy">Privacy Policy</a>. If you use the Service on behalf of a company,
        you represent that you have authority to bind that company, and &ldquo;you&rdquo;
        includes that company.
      </p>
      <p>
        If you do not agree, do not use the Service.
      </p>
    </section>

    <section>
      <h2>2. The Service</h2>
      <p>
        AgencyDesk provides AI-assisted tools for insurance agency operations, which may
        include document intake, classification, field extraction, account summaries, flags,
        suggested CRM updates, exports, team collaboration, and related features. Features
        may change over time. We may offer free, pilot, beta, or paid plans with different
        limits.
      </p>
    </section>

    <section>
      <h2>3. Eligibility and accounts</h2>
      <ul>
        <li>You must be at least 18 years old and able to form a binding contract.</li>
        <li>
          You must provide accurate account information and keep credentials confidential.
        </li>
        <li>
          You are responsible for all activity under your accounts and workspaces, including
          teammate actions.
        </li>
        <li>
          Workspace owners control invitations and roles. Notify us promptly of unauthorized
          access at{' '}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </li>
      </ul>
    </section>

    <section>
      <h2>4. Customer content and licenses</h2>
      <p>
        &ldquo;Customer Content&rdquo; means data, documents, text, images, and other
        materials you or your users upload or submit to the Service (including insurance
        client files).
      </p>
      <p>
        You retain ownership of Customer Content. You grant AgencyDesk a worldwide,
        non-exclusive, royalty-free license to host, store, process, transmit, display, and
        create derivative outputs from Customer Content solely to provide, maintain, secure,
        and improve the Service for you, including using subprocessors (such as hosting,
        database, and AI model providers).
      </p>
      <p>You represent and warrant that:</p>
      <ul>
        <li>
          You have all rights, consents, and authority needed to upload Customer Content and
          to permit processing described in these Terms and the Privacy Policy
        </li>
        <li>
          Customer Content does not infringe others&rsquo; rights or violate law, regulation,
          or professional / insurance rules applicable to you
        </li>
        <li>
          You will not upload content you are not permitted to process with third-party AI or
          cloud providers
        </li>
      </ul>
    </section>

    <section>
      <h2>5. AI outputs — critical limitations</h2>
      <p>
        The Service uses artificial intelligence and machine learning. Outputs (extractions,
        summaries, flags, suggested updates, confidence scores, exports, and similar results)
        may be incomplete, incorrect, outdated, or misleading.
      </p>
      <p>
        <strong>
          AgencyDesk is not an insurance carrier, broker of record, law firm, or substitute
          for licensed professional judgment.
        </strong>{' '}
        Outputs are decision-support tools only. You must review all outputs before relying
        on them, submitting to markets, updating an AMS/CRM, advising clients, or taking any
        action that could affect coverage, compliance, or client outcomes.
      </p>
      <p>Without limiting the foregoing:</p>
      <ul>
        <li>
          We do not guarantee accuracy, completeness, or fitness of any extraction, flag, or
          analysis
        </li>
        <li>
          Confidence scores are estimates, not warranties
        </li>
        <li>
          You remain solely responsible for regulatory compliance, E&amp;O risk management,
          client communications, and filing accuracy
        </li>
      </ul>
    </section>

    <section>
      <h2>6. Acceptable use</h2>
      <p>You will not, and will not allow others to:</p>
      <ul>
        <li>Violate law or third-party rights</li>
        <li>
          Upload malware, attempt unauthorized access, probe, scrape beyond normal use, or
          disrupt the Service
        </li>
        <li>
          Reverse engineer, resell, or provide the Service to third parties except as
          expressly allowed
        </li>
        <li>
          Use the Service to train competing models in a way that extracts proprietary model
          weights or system prompts beyond ordinary business use of outputs
        </li>
        <li>
          Misrepresent AI outputs as human-verified professional advice without review
        </li>
        <li>Use the Service for consumers under the age of 16</li>
      </ul>
      <p>We may suspend or terminate access for violations or risk to the Service or others.</p>
    </section>

    <section>
      <h2>7. Subscriptions, fees, and taxes</h2>
      <ul>
        <li>
          Paid plans are billed in advance on a recurring basis (typically monthly) via Stripe
          unless otherwise stated at checkout.
        </li>
        <li>
          Prices are as shown at purchase; promotional codes (for example early-customer
          discounts) apply only as described at redemption and may be withdrawn prospectively.
        </li>
        <li>
          Fees are generally non-refundable except where required by law or expressly stated
          by us in writing.
        </li>
        <li>
          You authorize us and Stripe to charge your payment method for recurring fees until
          you cancel.
        </li>
        <li>
          You are responsible for applicable taxes. Where Stripe Tax or similar tools are
          enabled, tax may be calculated and collected at checkout.
        </li>
        <li>
          You can manage billing through the in-product billing portal where available.
          Cancellation typically takes effect at the end of the then-current billing period.
        </li>
      </ul>
    </section>

    <section>
      <h2>8. Pilots, betas, and free access</h2>
      <p>
        Pilot, beta, or complimentary access is provided &ldquo;as is,&rdquo; may be modified
        or ended at any time, and may be subject to additional guidelines we provide. We have
        no obligation to release any feature generally.
      </p>
    </section>

    <section>
      <h2>9. Intellectual property</h2>
      <p>
        The Service, including software, branding, UI, documentation, and underlying
        technology (excluding Customer Content), is owned by AgencyDesk and its licensors.
        No rights are granted except as expressly stated in these Terms.
      </p>
    </section>

    <section>
      <h2>10. Confidentiality</h2>
      <p>
        Each party may receive confidential information from the other. The receiving party
        will use reasonable care to protect it and use it only for purposes of the Service
        relationship, except for information that is public, independently developed, or
        rightfully received from others without duty. We may disclose confidential information
        if required by law, after giving notice where legally permitted.
      </p>
    </section>

    <section>
      <h2>11. Third-party services</h2>
      <p>
        The Service depends on third parties (including hosting, authentication, storage,
        payments, and AI providers). Their outages or changes may affect availability. Your
        use of third-party sign-in (for example Google) is also subject to that provider&rsquo;s
        terms.
      </p>
    </section>

    <section>
      <h2>12. Disclaimers</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE AND ALL OUTPUTS ARE PROVIDED
        &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE,&rdquo; WITHOUT WARRANTIES OF ANY KIND,
        WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND ACCURACY. WE DO NOT WARRANT THAT THE
        SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT OUTPUTS WILL MEET YOUR
        REQUIREMENTS OR BE FREE FROM OMISSIONS.
      </p>
    </section>

    <section>
      <h2>13. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, AGENCYDESK AND ITS SUPPLIERS WILL NOT BE
        LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE
        DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, BUSINESS OPPORTUNITY, OR
        COVER, EVEN IF ADVISED OF THE POSSIBILITY.
      </p>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL AGGREGATE LIABILITY ARISING OUT OF
        OR RELATED TO THE SERVICE OR THESE TERMS WILL NOT EXCEED THE GREATER OF (A) THE
        AMOUNTS YOU PAID TO AGENCYDESK FOR THE SERVICE IN THE TWELVE (12) MONTHS BEFORE THE
        CLAIM OR (B) ONE HUNDRED CANADIAN DOLLARS (CAD $100) IF YOU HAVE NOT PAID ANY FEES.
      </p>
      <p>
        Some jurisdictions do not allow certain limitations; in those cases, our liability is
        limited to the fullest extent permitted.
      </p>
    </section>

    <section>
      <h2>14. Indemnification</h2>
      <p>
        You will defend, indemnify, and hold harmless AgencyDesk and its personnel from and
        against claims, damages, losses, and expenses (including reasonable legal fees)
        arising out of or related to: (a) Customer Content; (b) your use of the Service or
        Outputs; (c) your breach of these Terms; or (d) your violation of law or third-party
        rights, including client privacy or insurance regulatory obligations.
      </p>
    </section>

    <section>
      <h2>15. Suspension and termination</h2>
      <p>
        You may stop using the Service at any time and cancel a paid subscription as described
        in billing settings. We may suspend or terminate access immediately for material
        breach, non-payment, legal risk, or misuse. Upon termination, your right to use the
        Service ends. Sections that by nature should survive (including ownership,
        disclaimers, limitations, indemnity, and governing law) will survive.
      </p>
    </section>

    <section>
      <h2>16. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of the Province of Ontario and the federal laws
        of Canada applicable therein, without regard to conflict-of-law rules. Subject to
        mandatory consumer protections that cannot be waived, the courts located in Toronto,
        Ontario will have exclusive jurisdiction over disputes, and each party consents to
        that venue.
      </p>
      <p>
        Before filing a claim, you agree to try to resolve the dispute informally by emailing{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> and allowing 30 days
        for a response.
      </p>
    </section>

    <section>
      <h2>17. Export and sanctions</h2>
      <p>
        You may not use the Service if you are prohibited under applicable export control or
        sanctions laws, or in a sanctioned territory.
      </p>
    </section>

    <section>
      <h2>18. Changes to the Terms</h2>
      <p>
        We may update these Terms by posting a revised version with a new &ldquo;Last
        updated&rdquo; date. If changes are material, we may provide additional notice. Your
        continued use after the effective date constitutes acceptance where permitted by law.
        If you do not agree, you must stop using the Service and cancel any subscription.
      </p>
    </section>

    <section>
      <h2>19. General</h2>
      <p>
        These Terms and the Privacy Policy are the entire agreement regarding the Service and
        supersede prior agreements on the same subject. If a provision is unenforceable, the
        remainder stays in effect. Failure to enforce a provision is not a waiver. You may not
        assign these Terms without our consent; we may assign them in connection with a
        corporate transaction. Notices may be sent to your account email or to{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </section>

    <section>
      <h2>20. Contact</h2>
      <p>
        Legal notices and questions:{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
    </section>
  </LegalPageShell>
)
