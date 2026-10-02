import { useMemo, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  Check,
  CheckCheck,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react'

export interface DemoExtraction {
  id: string
  fieldLabel: string
  value: string
  confidence: number
  sourceDoc: string
  sourcePage: string
  status: 'pending' | 'approved' | 'edited'
  editedValue?: string
}

export interface DemoFlag {
  id: string
  severity: 'high' | 'medium' | 'low'
  title: string
  detail: string
  sourceDoc: string
}

export interface DemoAccount {
  id: string
  name: string
  industry: string
  policyPeriod: string
  producer: string
  documents: Array<{
    name: string
    type: string
    size: string
    confidence: number
    status: 'processed' | 'analyzing'
  }>
  extractions: DemoExtraction[]
  flags: DemoFlag[]
  crmBlock: string
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'maple-ridge',
    name: 'Maple Ridge Logistics LLC',
    industry: 'Regional Freight & Commercial Trucking (18 Units)',
    policyPeriod: '2026-04-01 to 2027-04-01',
    producer: 'Sarah Jenkins (Commercial Ops)',
    documents: [
      {
        name: 'ACORD_125_Maple_Ridge_2026.pdf',
        type: 'ACORD 125 Commercial App',
        size: '284 KB',
        confidence: 98,
        status: 'processed',
      },
      {
        name: 'Travelers_Loss_Run_2024_2026.pdf',
        type: 'Carrier Loss Run (3 Yrs)',
        size: '156 KB',
        confidence: 96,
        status: 'processed',
      },
      {
        name: 'Hartford_GL_Dec_Page_2026.pdf',
        type: 'Declarations Page',
        size: '98 KB',
        confidence: 98,
        status: 'processed',
      },
      {
        name: 'COI_Request_Warehouse_Portland.pdf',
        type: 'Certificate of Insurance',
        size: '64 KB',
        confidence: 94,
        status: 'processed',
      },
    ],
    extractions: [
      {
        id: 'mr-1',
        fieldLabel: 'Named Insured',
        value: 'Maple Ridge Logistics LLC',
        confidence: 98,
        sourceDoc: 'ACORD 125',
        sourcePage: 'Page 1, applicant section',
        status: 'approved',
      },
      {
        id: 'mr-2',
        fieldLabel: 'Federal EIN',
        value: '84-2938471',
        confidence: 96,
        sourceDoc: 'ACORD 125',
        sourcePage: 'Page 1, tax identification block',
        status: 'approved',
      },
      {
        id: 'mr-3',
        fieldLabel: 'GL Occurrence Limit',
        value: '$1,000,000',
        confidence: 94,
        sourceDoc: 'Hartford Dec Page',
        sourcePage: 'Page 2, schedule of coverage',
        status: 'approved',
      },
      {
        id: 'mr-4',
        fieldLabel: 'Auto Combined Single Limit (CSL)',
        value: '$1,000,000 CSL',
        confidence: 93,
        sourceDoc: 'Hartford Dec Page',
        sourcePage: 'Page 3, automobile liability section',
        status: 'approved',
      },
      {
        id: 'mr-5',
        fieldLabel: 'Power Units / Fleet Schedule',
        value: '18 tractors, 24 trailers',
        confidence: 86,
        sourceDoc: 'ACORD 125',
        sourcePage: 'Page 2, vehicle schedule notes',
        status: 'edited',
        editedValue: '18 power units, 24 dry van trailers',
      },
      {
        id: 'mr-6',
        fieldLabel: '3-Year Total Incurred Losses',
        value: '$127,450 across 4 claims',
        confidence: 91,
        sourceDoc: 'Travelers Loss Run',
        sourcePage: 'Summary page, total incurred column',
        status: 'pending',
      },
    ],
    flags: [
      {
        id: 'mr-flag-1',
        severity: 'high',
        title: 'Loss run valuation older than 60 days',
        detail:
          'Travelers loss run valuation date is March 15, 2026. Underwriting renewal guidelines require fresh runs dated within 30 days of binding.',
        sourceDoc: 'Travelers_Loss_Run_2024_2026.pdf (Header)',
      },
      {
        id: 'mr-flag-2',
        severity: 'high',
        title: 'Missing scheduled driver roster',
        detail:
          'ACORD 125 indicates 18 power units in operation, but the supplemental driver MVR schedule is not attached to this submission packet.',
        sourceDoc: 'ACORD_125_Maple_Ridge_2026.pdf (Page 2)',
      },
      {
        id: 'mr-flag-3',
        severity: 'medium',
        title: 'Policy number suffix discrepancy',
        detail:
          'Expiring declarations page lists policy # CGL-8847291-02, whereas the renewal ACORD lists CGL-8847291-03.',
        sourceDoc: 'Hartford_GL_Dec_Page_2026.pdf vs ACORD 125',
      },
    ],
    crmBlock: `=== MAPLE RIDGE LOGISTICS LLC — RENEWAL PREP (2026-2027) ===
Insured: Maple Ridge Logistics LLC (FEIN: 84-2938471)
Term: 2026-04-01 to 2027-04-01 | Renewal Type: Commercial P&C
GL Carrier: Hartford Fire Insurance Co. (Policy: CGL-8847291-03)
Limits: $1,000,000 Occurrence / $2,000,000 Aggregate
Auto Liability: $1,000,000 CSL (18 power units, 24 dry van trailers)
3-Year Loss Total: $127,450 (4 claims, largest single $89,200 closed)
Reviewer: Sarah Jenkins | Status: Human Approved & Staged
Pending Action: Request updated driver roster & 30-day loss run from Travelers.`,
  },
  {
    id: 'apex-construction',
    name: 'Apex Peak Construction Inc.',
    industry: 'Commercial General Contractor ($14.2M Volume)',
    policyPeriod: '2026-05-15 to 2027-05-15',
    producer: 'Marcus Vance (Commercial Desk)',
    documents: [
      {
        name: 'ACORD_125_126_Apex_Peak.pdf',
        type: 'ACORD 125/126 Application',
        size: '412 KB',
        confidence: 99,
        status: 'processed',
      },
      {
        name: 'Liberty_Mutual_Loss_Runs_5yr.pdf',
        type: 'Carrier Loss Run (5 Yrs)',
        size: '224 KB',
        confidence: 97,
        status: 'processed',
      },
      {
        name: 'Builders_Risk_Schedule_Denver.pdf',
        type: 'Inland Marine / Builder Risk',
        size: '180 KB',
        confidence: 95,
        status: 'processed',
      },
    ],
    extractions: [
      {
        id: 'ap-1',
        fieldLabel: 'Named Insured',
        value: 'Apex Peak Construction Inc.',
        confidence: 99,
        sourceDoc: 'ACORD 125',
        sourcePage: 'Page 1, named insured',
        status: 'approved',
      },
      {
        id: 'ap-2',
        fieldLabel: 'Annual Gross Receipts',
        value: '$14,250,000',
        confidence: 95,
        sourceDoc: 'ACORD 125',
        sourcePage: 'Page 3, financial schedule',
        status: 'approved',
      },
      {
        id: 'ap-3',
        fieldLabel: 'Subcontracted Cost Percentage',
        value: '65% ($9.26M subcontracted)',
        confidence: 92,
        sourceDoc: 'ACORD 126',
        sourcePage: 'Page 2, contractor supplement',
        status: 'approved',
      },
      {
        id: 'ap-4',
        fieldLabel: 'Commercial Umbrella Limit',
        value: '$10,000,000 Occurrence / Aggregate',
        confidence: 97,
        sourceDoc: 'ACORD 126',
        sourcePage: 'Page 4, umbrella line',
        status: 'approved',
      },
      {
        id: 'ap-5',
        fieldLabel: 'Workers Comp Experience Mod (EMR)',
        value: '0.88 (Favorable debit rating)',
        confidence: 96,
        sourceDoc: 'Liberty Loss Run',
        sourcePage: 'Page 1, rating summary',
        status: 'approved',
      },
    ],
    flags: [
      {
        id: 'ap-flag-1',
        severity: 'high',
        title: 'Subcontractor indemnity clause missing 30-day notice',
        detail:
          'Sample subcontractor agreement does not include mandatory 30-day notice of cancellation clause for additional insured status.',
        sourceDoc: 'Builders_Risk_Schedule_Denver.pdf (Section 4.2)',
      },
      {
        id: 'ap-flag-2',
        severity: 'medium',
        title: 'Roofing exclusion on expiring policy',
        detail:
          'Expiring Liberty Mutual policy has an open-roof limitation endorsement. Verify whether new warehouse projects involve roofing operations.',
        sourceDoc: 'Liberty_Mutual_Loss_Runs_5yr.pdf (Endorsement #3)',
      },
    ],
    crmBlock: `=== APEX PEAK CONSTRUCTION INC. — RENEWAL PREP (2026-2027) ===
Insured: Apex Peak Construction Inc. | Colorado Licensed GC
Projected Gross Receipts: $14,250,000 (65% Subcontracted)
GL Program: $1,000,000 / $2,000,000 CGL + $10,000,000 Commercial Umbrella
Workers' Comp E-Mod: 0.88 (Clean 5-year history)
Reviewer: Marcus Vance | Status: High-Confidence Verified
Action Item: Update subcontractor insurance agreement with 30-day notice requirement.`,
  },
  {
    id: 'cascade-craft',
    name: 'Cascade Craft Roasters & Cafes',
    industry: 'Specialty Food Roaster & 4 Retail Cafes (Seattle, WA)',
    policyPeriod: '2026-06-01 to 2027-06-01',
    producer: 'Elena Rostova (Account Ops)',
    documents: [
      {
        name: 'ACORD_140_Property_Cascade.pdf',
        type: 'ACORD 140 Property Section',
        size: '340 KB',
        confidence: 98,
        status: 'processed',
      },
      {
        name: 'Chubb_Property_Dec_Page.pdf',
        type: 'Commercial Property Dec',
        size: '175 KB',
        confidence: 97,
        status: 'processed',
      },
      {
        name: 'Hartford_Loss_Run_2026.pdf',
        type: 'Carrier Loss Run (3 Yrs)',
        size: '120 KB',
        confidence: 95,
        status: 'processed',
      },
    ],
    extractions: [
      {
        id: 'cc-1',
        fieldLabel: 'Named Insured',
        value: 'Cascade Craft Roasters LLC',
        confidence: 99,
        sourceDoc: 'ACORD 140',
        sourcePage: 'Page 1, applicant header',
        status: 'approved',
      },
      {
        id: 'cc-2',
        fieldLabel: 'Total Insured Values (TIV)',
        value: '$6,850,000 across 4 locations',
        confidence: 96,
        sourceDoc: 'Chubb Dec Page',
        sourcePage: 'Page 2, statement of values',
        status: 'approved',
      },
      {
        id: 'cc-3',
        fieldLabel: 'Business Interruption / ALS',
        value: '$1,200,000 Actual Loss Sustained (12 Mos)',
        confidence: 94,
        sourceDoc: 'Chubb Dec Page',
        sourcePage: 'Page 3, time element coverage',
        status: 'approved',
      },
      {
        id: 'cc-4',
        fieldLabel: 'Spoilage & Temperature Change Sublimit',
        value: '$250,000 per location',
        confidence: 92,
        sourceDoc: 'ACORD 140',
        sourcePage: 'Page 4, equipment breakdown section',
        status: 'approved',
      },
    ],
    flags: [
      {
        id: 'cc-flag-1',
        severity: 'high',
        title: 'Central station alarm certificate expired',
        detail:
          'Roasting plant building insurance credit relies on central station burglar alarm certificate, which expired 45 days ago.',
        sourceDoc: 'ACORD_140_Property_Cascade.pdf (Protection Class)',
      },
      {
        id: 'cc-flag-2',
        severity: 'medium',
        title: 'Lender loss payable clause missing for leased roasters',
        detail:
          'Loring S35 Kestrel commercial roaster is financed through Pacific Capital, requiring an active Loss Payable clause.',
        sourceDoc: 'Chubb_Property_Dec_Page.pdf (Equipment Schedule)',
      },
    ],
    crmBlock: `=== CASCADE CRAFT ROASTERS LLC — RENEWAL PREP (2026-2027) ===
Insured: Cascade Craft Roasters LLC (4 Locations: Seattle, Bellevue, Tacoma)
TIV: $6,850,000 Building & BPP | BI / ALS: $1,200,000
Primary Carrier: Chubb Custom Markets (Property Policy # CP-992182-01)
Reviewer: Elena Rostova | Status: Verified
Urgent Action: Request renewed central alarm certificate for roasting facility before binding.`,
  },
]

type TabKey = 'extractions' | 'documents' | 'flags' | 'crm'

export function ProductConsolePreview() {
  const [selectedAccountId, setSelectedAccountId] = useState('maple-ridge')
  const [activeTab, setActiveTab] = useState<TabKey>('extractions')
  const [filterConfidence, setFilterConfidence] = useState<'all' | 'high' | 'pending'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [bulkApprovedToast, setBulkApprovedToast] = useState(false)

  // Local state for interactive extractions
  const [accountExtractions, setAccountExtractions] = useState<Record<string, DemoExtraction[]>>(() => {
    const initial: Record<string, DemoExtraction[]> = {}
    DEMO_ACCOUNTS.forEach((a) => {
      initial[a.id] = [...a.extractions]
    })
    return initial
  })

  const currentAccount = useMemo(
    () => DEMO_ACCOUNTS.find((a) => a.id === selectedAccountId) ?? DEMO_ACCOUNTS[0],
    [selectedAccountId],
  )

  const extractions = accountExtractions[currentAccount.id] ?? currentAccount.extractions

  const filteredExtractions = useMemo(() => {
    return extractions.filter((ext) => {
      const matchesSearch =
        ext.fieldLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ext.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ext.sourceDoc.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (filterConfidence === 'high') return ext.confidence >= 90
      if (filterConfidence === 'pending') return ext.status === 'pending'
      return true
    })
  }, [extractions, searchQuery, filterConfidence])

  const approvedCount = extractions.filter((e) => e.status === 'approved' || e.status === 'edited').length
  const totalCount = extractions.length

  function handleToggleApprove(id: string) {
    setAccountExtractions((prev) => {
      const list = prev[currentAccount.id] ?? []
      return {
        ...prev,
        [currentAccount.id]: list.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status: item.status === 'approved' ? 'pending' : 'approved',
            }
          }
          return item
        }),
      }
    })
  }

  function handleBulkApprove() {
    setAccountExtractions((prev) => {
      const list = prev[currentAccount.id] ?? []
      return {
        ...prev,
        [currentAccount.id]: list.map((item) => {
          if (item.confidence >= 90) {
            return { ...item, status: 'approved' }
          }
          return item
        }),
      }
    })
    setBulkApprovedToast(true)
    setTimeout(() => setBulkApprovedToast(false), 2400)
  }

  function handleCopyCrm() {
    navigator.clipboard.writeText(currentAccount.crmBlock)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="product-console" id="product-demo">
      {/* Console Frame */}
      <div className="product-console__window">
        {/* Top Window Bar (macOS / SaaS Chrome) */}
        <div className="product-console__topbar">
          <div className="product-console__dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>

          <div className="product-console__org-badge">
            <Building2 size={13} className="text-slate-400" />
            <span className="product-console__org-name">Harbor Point Insurance Partners</span>
            <span className="product-console__env-pill">OPS CONSOLE 2.4</span>
          </div>

          <div className="product-console__engine-status">
            <span className="product-console__pulse" />
            <span>AI Engine Active · 98.4% Confidence</span>
          </div>
        </div>

        {/* Interactive Workspace Navigation Header */}
        <div className="product-console__workspace-header">
          <div className="product-console__account-selector">
            <div className="product-console__account-label">ACTIVE CLIENT FILE</div>
            <div className="product-console__account-dropdown-wrapper">
              <select
                aria-label="Select sample client file"
                value={selectedAccountId}
                onChange={(e) => {
                  setSelectedAccountId(e.target.value)
                  setSearchQuery('')
                }}
                className="product-console__account-select"
              >
                {DEMO_ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} — {acc.industry.split('(')[0]}
                  </option>
                ))}
              </select>
              <div className="product-console__account-meta">
                <span>{currentAccount.industry}</span>
                <span className="meta-sep">&bull;</span>
                <span>Term: {currentAccount.policyPeriod}</span>
                <span className="meta-sep">&bull;</span>
                <span>Reviewer: {currentAccount.producer}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="product-console__quick-stats">
            <div className="stat-chip">
              <span className="stat-chip__label">Documents</span>
              <span className="stat-chip__value">{currentAccount.documents.length} Files</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip__label">Review Progress</span>
              <span className="stat-chip__value stat-chip__value--green">
                {approvedCount}/{totalCount} Approved
              </span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip__label">Risk Flags</span>
              <span className="stat-chip__value stat-chip__value--amber">
                {currentAccount.flags.length} Detected
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="product-console__tabs-bar">
          <div className="product-console__tabs">
            <button
              type="button"
              onClick={() => setActiveTab('extractions')}
              className={`console-tab ${activeTab === 'extractions' ? 'console-tab--active' : ''}`}
            >
              <FileCheck size={15} />
              <span>Review Queue & Citations</span>
              <span className="tab-badge">{extractions.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('documents')}
              className={`console-tab ${activeTab === 'documents' ? 'console-tab--active' : ''}`}
            >
              <FileSpreadsheet size={15} />
              <span>Ingested Documents</span>
              <span className="tab-badge">{currentAccount.documents.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('flags')}
              className={`console-tab ${activeTab === 'flags' ? 'console-tab--active' : ''}`}
            >
              <AlertTriangle size={15} />
              <span>Risk & Gap Flags</span>
              <span className="tab-badge tab-badge--alert">{currentAccount.flags.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('crm')}
              className={`console-tab ${activeTab === 'crm' ? 'console-tab--active' : ''}`}
            >
              <ClipboardCheck size={15} />
              <span>AMS / CRM Staging Block</span>
              <span className="tab-badge tab-badge--ready">Ready</span>
            </button>
          </div>

          {/* Right Toolbar Action */}
          <div className="product-console__toolbar-actions">
            {activeTab === 'extractions' && (
              <button
                type="button"
                onClick={handleBulkApprove}
                className="console-action-btn console-action-btn--primary"
                title="Approve all fields with confidence score >= 90%"
              >
                <CheckCheck size={14} />
                <span>Bulk Approve (≥90%)</span>
              </button>
            )}

            {activeTab === 'crm' && (
              <button
                type="button"
                onClick={handleCopyCrm}
                className="console-action-btn console-action-btn--primary"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy CRM Block'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Bulk approve notification toast */}
        {bulkApprovedToast && (
          <div className="console-toast">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>High-confidence fields verified & approved by reviewer</span>
          </div>
        )}

        {/* Tab Content 1: Review Queue & Citations */}
        {activeTab === 'extractions' && (
          <div className="product-console__body">
            {/* Filter controls */}
            <div className="product-console__subbar">
              <div className="console-search">
                <Search size={14} className="console-search__icon" />
                <input
                  type="text"
                  placeholder="Filter extracted fields, values or citations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="console-search__input"
                />
              </div>

              <div className="console-filters">
                <span className="console-filters__label">Filter:</span>
                <button
                  type="button"
                  onClick={() => setFilterConfidence('all')}
                  className={`filter-pill ${filterConfidence === 'all' ? 'filter-pill--active' : ''}`}
                >
                  All ({extractions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterConfidence('high')}
                  className={`filter-pill ${filterConfidence === 'high' ? 'filter-pill--active' : ''}`}
                >
                  High Confidence ≥90% ({extractions.filter((e) => e.confidence >= 90).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterConfidence('pending')}
                  className={`filter-pill ${filterConfidence === 'pending' ? 'filter-pill--active' : ''}`}
                >
                  Awaiting Review ({extractions.filter((e) => e.status === 'pending').length})
                </button>
              </div>
            </div>

            {/* Extractions Table */}
            <div className="console-table-wrap">
              <table className="console-table">
                <thead>
                  <tr>
                    <th>FIELD & CITATION NOTE</th>
                    <th>EXTRACTED VALUE</th>
                    <th>CONFIDENCE</th>
                    <th>SOURCE DOCUMENT</th>
                    <th>VERIFICATION STATUS</th>
                    <th className="text-right">HUMAN REVIEW</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExtractions.map((row) => {
                    const isApproved = row.status === 'approved'
                    const isEdited = row.status === 'edited'
                    const isPending = row.status === 'pending'

                    return (
                      <tr key={row.id} className={`console-row ${isApproved ? 'console-row--approved' : ''}`}>
                        <td className="field-cell">
                          <div className="field-name">{row.fieldLabel}</div>
                          <div className="field-citation">
                            <span className="citation-icon">📌</span>
                            <span>{row.sourcePage}</span>
                          </div>
                        </td>

                        <td className="value-cell">
                          <span className={`extracted-value ${isEdited ? 'extracted-value--edited' : ''}`}>
                            {row.editedValue || row.value}
                          </span>
                          {isEdited && (
                            <span className="edited-indicator">Edited by ops</span>
                          )}
                        </td>

                        <td className="confidence-cell">
                          <div className="confidence-meter">
                            <div className="confidence-bar-bg">
                              <div
                                className={`confidence-bar-fill ${
                                  row.confidence >= 95
                                    ? 'fill-high'
                                    : row.confidence >= 90
                                      ? 'fill-good'
                                      : 'fill-warn'
                                }`}
                                style={{ width: `${row.confidence}%` }}
                              />
                            </div>
                            <span className="confidence-num">{row.confidence}%</span>
                          </div>
                        </td>

                        <td className="source-doc-cell">
                          <span className="source-tag">{row.sourceDoc}</span>
                        </td>

                        <td className="status-cell">
                          {isApproved && (
                            <span className="status-badge status-badge--approved">
                              <Check size={11} /> Approved
                            </span>
                          )}
                          {isEdited && (
                            <span className="status-badge status-badge--edited">
                              <UserCheck size={11} /> Human Edited
                            </span>
                          )}
                          {isPending && (
                            <span className="status-badge status-badge--pending">
                              <Sparkles size={11} /> Needs Approval
                            </span>
                          )}
                        </td>

                        <td className="action-cell text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleApprove(row.id)}
                            className={`row-toggle-btn ${
                              isApproved ? 'row-toggle-btn--active' : 'row-toggle-btn--approve'
                            }`}
                          >
                            {isApproved ? 'Undo' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            <div className="console-footer-note">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>
                <strong>Zero Automatic System Writes:</strong> All values staged above require explicit human approval before being committed to your AMS or CRM.
              </span>
            </div>
          </div>
        )}

        {/* Tab Content 2: Ingested Documents */}
        {activeTab === 'documents' && (
          <div className="product-console__body p-6">
            <div className="docs-grid">
              {currentAccount.documents.map((doc, idx) => (
                <div key={idx} className="doc-card">
                  <div className="doc-card__head">
                    <div className="doc-icon-wrap">
                      <FileText size={20} className="text-slate-700" />
                    </div>
                    <div className="doc-card__meta">
                      <span className="doc-card__type">{doc.type}</span>
                      <span className="doc-card__name">{doc.name}</span>
                    </div>
                  </div>

                  <div className="doc-card__stats">
                    <div className="stat-item">
                      <span className="stat-label">Size</span>
                      <span className="stat-val">{doc.size}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Classification</span>
                      <span className="stat-val stat-val--badge">{doc.confidence}% match</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Indexing</span>
                      <span className="stat-val stat-val--ok">
                        <CheckCircle2 size={12} /> Complete
                      </span>
                    </div>
                  </div>

                  <div className="doc-card__foot">
                    <span>Parsed 100% of pages · Text & tables indexed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Risk & Gap Flags */}
        {activeTab === 'flags' && (
          <div className="product-console__body p-6">
            <div className="flags-head">
              <div className="flags-head__title">
                <AlertCircle size={18} className="text-amber-500" />
                <span>Underwriting Gaps & Discrepancy Warnings</span>
              </div>
              <span className="flags-count-tag">{currentAccount.flags.length} Critical Items Found</span>
            </div>

            <div className="flags-list">
              {currentAccount.flags.map((flag) => (
                <div
                  key={flag.id}
                  className={`flag-card flag-card--${flag.severity}`}
                >
                  <div className="flag-card__header">
                    <span className={`flag-badge flag-badge--${flag.severity}`}>
                      {flag.severity.toUpperCase()} PRIORITY
                    </span>
                    <span className="flag-source">Source: {flag.sourceDoc}</span>
                  </div>
                  <h4 className="flag-card__title">{flag.title}</h4>
                  <p className="flag-card__detail">{flag.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 4: AMS / CRM Staging Block */}
        {activeTab === 'crm' && (
          <div className="product-console__body p-6">
            <div className="crm-stage-container">
              <div className="crm-stage-header">
                <div>
                  <h4 className="crm-title">Ready-to-Paste AMS360 / Applied Epic / Salesforce Block</h4>
                  <p className="crm-sub">
                    Clean, standardized account update packet formatted with exact source citations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCrm}
                  className="console-action-btn console-action-btn--primary"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy CRM Block'}</span>
                </button>
              </div>

              <div className="crm-code-box">
                <pre>{currentAccount.crmBlock}</pre>
              </div>

              <div className="crm-compat-strip">
                <span className="compat-label">Directly compatible with:</span>
                <span className="compat-pill">Applied Epic</span>
                <span className="compat-pill">Vertafore AMS360</span>
                <span className="compat-pill">HawkSoft</span>
                <span className="compat-pill">Salesforce Financial Services Cloud</span>
                <span className="compat-pill">NowCerts / EZLynx</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
