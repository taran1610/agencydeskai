import { useMemo, useState } from 'react'
import { ArrowRight, Calculator, Clock, ShieldAlert, TrendingUp } from 'lucide-react'
import { site } from '../config/site'

export function AgencyRoiCalculator() {
  const [renewalsPerMonth, setRenewalsPerMonth] = useState(45)
  const [hourlyOpsRate, setHourlyOpsRate] = useState(48)
  const [currentMinsPerPacket, setCurrentMinsPerPacket] = useState(45)

  // Calculations
  const stats = useMemo(() => {
    // AgencyDesk AI cuts intake + classification + initial review from ~45 min to ~6 min (86% reduction)
    const agencyDeskMinsPerPacket = 7
    const minsSavedPerPacket = Math.max(5, currentMinsPerPacket - agencyDeskMinsPerPacket)

    const totalHoursSavedMonth = Math.round((renewalsPerMonth * minsSavedPerPacket) / 60)
    const totalDollarsSavedMonth = Math.round(totalHoursSavedMonth * hourlyOpsRate)
    const annualSavings = totalDollarsSavedMonth * 12
    const submissionTurnaround = currentMinsPerPacket > 30 ? '3.5 hours vs 2.5 days' : 'Same day turnaround'

    return {
      hoursSavedMonth: totalHoursSavedMonth,
      dollarsSavedMonth: totalDollarsSavedMonth,
      annualSavings,
      turnaround: submissionTurnaround,
      minsSavedPerPacket,
    }
  }, [renewalsPerMonth, hourlyOpsRate, currentMinsPerPacket])

  return (
    <div className="roi-calculator">
      <div className="roi-calculator__inner">
        {/* Left Inputs */}
        <div className="roi-calculator__controls">
          <div className="roi-calculator__head">
            <span className="roi-badge">
              <Calculator size={13} />
              <span>INTERACTIVE ROI ESTIMATOR</span>
            </span>
            <h3 className="roi-title">Calculate your agency&rsquo;s monthly intake savings</h3>
            <p className="roi-sub">
              See how eliminating manual document re-keying and ACORD packet triage impacts your bottom line.
            </p>
          </div>

          <div className="roi-sliders">
            {/* Slider 1 */}
            <div className="roi-slider-group">
              <div className="roi-slider-label-row">
                <label htmlFor="renewals-range">Commercial accounts / packets per month</label>
                <span className="roi-slider-val">{renewalsPerMonth} packets</span>
              </div>
              <input
                id="renewals-range"
                type="range"
                min="10"
                max="250"
                step="5"
                value={renewalsPerMonth}
                onChange={(e) => setRenewalsPerMonth(Number(e.target.value))}
                onInput={(e) => setRenewalsPerMonth(Number((e.target as HTMLInputElement).value))}
                className="roi-slider-input"
              />
              <div className="roi-slider-scale">
                <span>10</span>
                <span>100</span>
                <span>250+</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="roi-slider-group">
              <div className="roi-slider-label-row">
                <label htmlFor="time-range">Current manual prep time per packet</label>
                <span className="roi-slider-val">{currentMinsPerPacket} minutes</span>
              </div>
              <input
                id="time-range"
                type="range"
                min="20"
                max="90"
                step="5"
                value={currentMinsPerPacket}
                onChange={(e) => setCurrentMinsPerPacket(Number(e.target.value))}
                onInput={(e) => setCurrentMinsPerPacket(Number((e.target as HTMLInputElement).value))}
                className="roi-slider-input"
              />
              <div className="roi-slider-scale">
                <span>20 min</span>
                <span>45 min (Avg)</span>
                <span>90 min</span>
              </div>
            </div>

            {/* Slider 3 */}
            <div className="roi-slider-group">
              <div className="roi-slider-label-row">
                <label htmlFor="rate-range">Average account manager / ops hourly rate</label>
                <span className="roi-slider-val">${hourlyOpsRate} / hr</span>
              </div>
              <input
                id="rate-range"
                type="range"
                min="30"
                max="90"
                step="2"
                value={hourlyOpsRate}
                onChange={(e) => setHourlyOpsRate(Number(e.target.value))}
                onInput={(e) => setHourlyOpsRate(Number((e.target as HTMLInputElement).value))}
                className="roi-slider-input"
              />
              <div className="roi-slider-scale">
                <span>$30/hr</span>
                <span>$48/hr</span>
                <span>$90/hr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="roi-calculator__results">
          <div className="roi-results-card">
            <div className="roi-results-top">
              <span className="roi-results-tag">ESTIMATED EFFICIENCY GAIN</span>
              <div className="roi-big-stat">
                <span className="roi-currency">$</span>
                <span className="roi-number">{stats.dollarsSavedMonth.toLocaleString()}</span>
                <span className="roi-freq">/ month</span>
              </div>
              <p className="roi-annual-note">
                Equal to <strong>${stats.annualSavings.toLocaleString()}</strong> in recovered operational capacity annually.
              </p>
            </div>

            <div className="roi-stat-breakdown">
              <div className="breakdown-item">
                <div className="breakdown-icon">
                  <Clock size={16} className="text-emerald-400" />
                </div>
                <div>
                  <span className="breakdown-val">{stats.hoursSavedMonth} hours / mo</span>
                  <span className="breakdown-lbl">Saved on manual document re-keying</span>
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-icon">
                  <TrendingUp size={16} className="text-emerald-400" />
                </div>
                <div>
                  <span className="breakdown-val">84% faster</span>
                  <span className="breakdown-lbl">Average reduction in file staging time</span>
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-icon">
                  <ShieldAlert size={16} className="text-emerald-400" />
                </div>
                <div>
                  <span className="breakdown-val">0 E&amp;O risk additions</span>
                  <span className="breakdown-lbl">100% cited sources &amp; mandatory human review</span>
                </div>
              </div>
            </div>

            <div className="roi-cta-wrap">
              <a href={site.loginUrl} className="roi-btn">
                <span>Deploy AgencyDesk to your team</span>
                <ArrowRight size={15} />
              </a>
              <span className="roi-cta-sub">Takes under 5 minutes to launch your first workspace.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
