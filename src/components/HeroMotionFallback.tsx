/**
 * Pure CSS hero motion — runs when Remotion autoplay fails on static hosts.
 */
export function HeroMotionFallback({ active = false }: { active?: boolean }) {
  return (
    <div
      className={`hero-motion-fallback${active ? ' hero-motion-fallback--active' : ''}`}
      aria-hidden
    >
      <div className="hero-motion-fallback__panel hero-motion-fallback__panel--left">
        <div className="hero-motion-fallback__label">INBOUND PACKET</div>
        {['ACORD 125', 'Loss Runs', 'Policy Dec'].map((name, i) => (
          <div
            key={name}
            className="hero-motion-fallback__card"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            {name}
          </div>
        ))}
      </div>

      <div className="hero-motion-fallback__processor">
        <div className="hero-motion-fallback__ring" />
        <div className="hero-motion-fallback__core">AI</div>
        <div className="hero-motion-fallback__status">
          AgencyDesk AI processing
          <span className="hero-motion-fallback__dot" style={{ animationDelay: '0s' }}>.</span>
          <span className="hero-motion-fallback__dot" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="hero-motion-fallback__dot" style={{ animationDelay: '0.4s' }}>.</span>
        </div>
      </div>

      <div className="hero-motion-fallback__panel hero-motion-fallback__panel--right">
        <div className="hero-motion-fallback__label">REVIEW QUEUE</div>
        {[
          { k: 'Named insured', v: 'Pinecrest Logistics LLC' },
          { k: 'Renewal date', v: 'Mar 14, 2026' },
          { k: 'Locations', v: '7 sites · CA, OR, NV' },
          { k: 'Missing', v: 'Signed COI request', flag: true },
        ].map((row, i) => (
          <div
            key={row.k}
            className={`hero-motion-fallback__field${row.flag ? ' hero-motion-fallback__field--flag' : ''}`}
            style={{ animationDelay: `${1.2 + i * 0.5}s` }}
          >
            <span className="hero-motion-fallback__field-k">{row.k}</span>
            <span className="hero-motion-fallback__field-v">{row.v}</span>
          </div>
        ))}
      </div>

      {/* Flying doc ghosts */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="hero-motion-fallback__ghost"
          style={{ animationDelay: `${i * 2.4}s` }}
        />
      ))}
    </div>
  )
}
