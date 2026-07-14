/** Static review-queue mockup for the hero — matches the editorial landing design. */
export function HeroReviewCard() {
  return (
    <div className="hero-review" aria-hidden>
      <div className="hero-review__card">
        <div className="hero-review__head">
          <span className="hero-review__title">Review queue</span>
          <span className="hero-review__badge">Awaiting approval</span>
        </div>
        <div className="hero-review__fields">
          <div className="hero-review__field">
            <span className="hero-review__label">Named insured</span>
            <span className="hero-review__value hero-review__value--serif">
              Pinecrest Logistics LLC
            </span>
          </div>
          <div className="hero-review__field">
            <span className="hero-review__label">Document</span>
            <span className="hero-review__value hero-review__value--serif">
              ACORD 125 — Commercial application
            </span>
          </div>
          <div className="hero-review__field">
            <span className="hero-review__label">Renewal date</span>
            <span className="hero-review__value hero-review__value--serif">
              March 14, 2026
            </span>
          </div>
        </div>
        <div className="hero-review__foot">
          <span>3 fields</span>
          <span>Cited to source</span>
        </div>
      </div>
    </div>
  )
}
