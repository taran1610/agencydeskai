const citedFields = [
  { label: 'Named insured', value: 'Pinewest Logistics LLC', cite: 'ACORD 125 · p. 2' },
  { label: 'Policy number', value: 'CGL-449218', cite: 'ACORD 125 · p. 2' },
  { label: 'Effective date', value: 'April 1, 2026', cite: 'ACORD 125 · p. 2' },
  { label: 'Carrier', value: 'Northline Mutual', cite: 'Dec page · insurer' },
] as const

const syncRows = [
  ['Insured', 'Pinewest Logistics LLC'],
  ['Policy', 'CGL-449218'],
  ['Effective', 'April 1, 2026'],
  ['Carrier', 'Northline Mutual'],
] as const

export function ProductStage() {
  return (
    <figure className="stage">
      <div className="stage__window" aria-hidden="true">
        <div className="stage__bar">
          <span className="stage__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="stage__docname">
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4 1.5h5.2L12.5 5v9.2a.8.8 0 0 1-.8.8H4.3a.8.8 0 0 1-.8-.8V2.3a.8.8 0 0 1 .8-.8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path d="M9 1.7V5h3.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="stage__title">Commercial renewal — Pinewest Logistics LLC</span>
            <span className="stage__id">Sample</span>
          </span>
          <span className="stage__chip">Held for review</span>
        </div>

        <div className="stage__grid">
          <div className="pane pane--source">
            <p className="pane__label">Source document</p>
            <div className="paper">
              <div className="paper__head">
                <strong>ACORD 125</strong>
                <span>2016/03 · Page 2 of 4</span>
              </div>
              <p className="paper__section">Applicant</p>
              <div className="paper__row paper__row--hit">
                <span>Named insured</span>
                <em>Pinewest Logistics LLC</em>
              </div>
              <div className="paper__row">
                <span>Mailing address</span>
                <span className="paper__ghost" />
              </div>
              <p className="paper__section">Policy</p>
              <div className="paper__row paper__row--hit">
                <span>Policy number</span>
                <em>CGL-449218</em>
              </div>
              <div className="paper__row paper__row--hit">
                <span>Effective</span>
                <em>04/01/2026</em>
              </div>
              <div className="paper__row">
                <span>Description</span>
                <span className="paper__ghost paper__ghost--short" />
              </div>
            </div>
            <p className="paper__also">Also in the packet · declarations page, carrier line</p>
          </div>

          <div className="pane pane--fields">
            <p className="pane__label">Cited fields</p>
            <ul className="fields">
              {citedFields.map((field) => (
                <li key={field.label} className="field">
                  <span className="field__body">
                    <span className="field__k">{field.label}</span>
                    <span className="field__v">{field.value}</span>
                  </span>
                  <span className="field__cite">{field.cite}</span>
                </li>
              ))}
              <li className="field field--flag">
                <span className="field__body">
                  <span className="field__k">Missing from packet</span>
                  <span className="field__v">2023 loss run</span>
                </span>
                <span className="field__cite">Flagged</span>
              </li>
            </ul>
          </div>

          <div className="pane pane--sync">
            <p className="pane__label">Proposed AMS update</p>
            <p className="sync__count">
              <strong>4 fields</strong> staged. Nothing is written until a person approves.
            </p>
            <ul className="sync__list">
              {syncRows.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </li>
              ))}
            </ul>
            <div className="sync__dest">
              <span>Example destination</span>
              <strong>Applied Epic</strong>
            </div>
            <p className="sync__note">Copy into the AMS after review. This batch is still waiting.</p>
          </div>
        </div>
      </div>

      <ol className="stage__legend" aria-hidden="true">
        <li>
          <span>01</span> Document
        </li>
        <li>
          <span>02</span> Cited fields
        </li>
        <li>
          <span>03</span> Review-ready update
        </li>
      </ol>
      <figcaption>
        <span className="sr-only">
          Illustration of a commercial renewal packet: an ACORD 125 page, four fields tied to a
          page, a missing 2023 loss run, and a proposed AMS update that is not written until a
          person approves it. Applied Epic is an example destination.
        </span>
        Sample packet for illustration. Not a customer.
      </figcaption>
    </figure>
  )
}
