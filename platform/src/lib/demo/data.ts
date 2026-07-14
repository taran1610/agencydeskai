import type {
  ActionItem,
  AnalysisFlag,
  DocType,
  ExtractionStatus,
  SuggestedUpdate,
} from '@/lib/types'

export interface DemoDocumentSpec {
  filename: string
  mime_type: string
  size_bytes: number
  doc_type: DocType
  doc_type_confidence: number
  doc_type_reasoning: string
  model: string
  daysAgo: number
  extractions: Array<{
    field_key: string
    field_label: string
    value: string
    confidence: number
    source_note: string
    status: ExtractionStatus
    edited_value?: string
  }>
}

export interface DemoAccountSpec {
  name: string
  daysAgo: number
  documents: DemoDocumentSpec[]
  analysis?: {
    summary: string
    flags: AnalysisFlag[]
    suggested_updates: SuggestedUpdate[]
    action_items: ActionItem[]
    crm_export_block: string
    model: string
    daysAgo: number
  }
}

export const DEMO_ACCOUNTS: DemoAccountSpec[] = [
  {
    name: 'Maple Ridge Logistics',
    daysAgo: 12,
    documents: [
      {
        filename: 'ACORD_125_Maple_Ridge_2026.pdf',
        mime_type: 'application/pdf',
        size_bytes: 284_120,
        doc_type: 'acord_application',
        doc_type_confidence: 0.97,
        doc_type_reasoning:
          'Standard ACORD 125 commercial insurance application with insured name, operations, and limits schedule.',
        model: 'demo',
        daysAgo: 11,
        extractions: [
          {
            field_key: 'named_insured',
            field_label: 'Named insured',
            value: 'Maple Ridge Logistics LLC',
            confidence: 0.98,
            source_note: 'Page 1, applicant section',
            status: 'approved',
          },
          {
            field_key: 'mailing_address',
            field_label: 'Mailing address',
            value: '1840 Industrial Blvd, Suite 200, Portland, OR 97209',
            confidence: 0.91,
            source_note: 'Page 1, address block',
            status: 'pending',
          },
          {
            field_key: 'fein',
            field_label: 'FEIN',
            value: '84-2938471',
            confidence: 0.96,
            source_note: 'Page 1, tax ID',
            status: 'approved',
          },
          {
            field_key: 'business_description',
            field_label: 'Operations / description',
            value: 'Regional freight brokerage and short-haul trucking (OR, WA, ID)',
            confidence: 0.94,
            source_note: 'Page 2, nature of business',
            status: 'approved',
          },
          {
            field_key: 'policy_effective',
            field_label: 'Proposed effective date',
            value: '2026-04-01',
            confidence: 0.95,
            source_note: 'Page 1, policy period',
            status: 'approved',
          },
          {
            field_key: 'policy_expiration',
            field_label: 'Proposed expiration date',
            value: '2027-04-01',
            confidence: 0.95,
            source_note: 'Page 1, policy period',
            status: 'approved',
          },
          {
            field_key: 'gl_each_occurrence',
            field_label: 'GL each occurrence',
            value: '$1,000,000',
            confidence: 0.88,
            source_note: 'Page 3, limits table',
            status: 'pending',
          },
          {
            field_key: 'gl_aggregate',
            field_label: 'GL general aggregate',
            value: '$2,000,000',
            confidence: 0.92,
            source_note: 'Page 3, limits table',
            status: 'approved',
          },
          {
            field_key: 'auto_combined_single',
            field_label: 'Auto CSL',
            value: '$1,000,000',
            confidence: 0.93,
            source_note: 'Page 3, automobile limits',
            status: 'approved',
          },
          {
            field_key: 'workers_comp',
            field_label: 'Workers comp',
            value: 'Statutory — OR/WA',
            confidence: 0.89,
            source_note: 'Page 3, WC line',
            status: 'approved',
          },
          {
            field_key: 'fleet_count',
            field_label: 'Power units / fleet',
            value: '18 tractors, 22 trailers',
            confidence: 0.86,
            source_note: 'Page 2, vehicle schedule summary',
            status: 'edited',
            edited_value: '18 tractors, 24 trailers',
          },
        ],
      },
      {
        filename: 'Loss_Run_Travelers_2024-2026.pdf',
        mime_type: 'application/pdf',
        size_bytes: 156_800,
        doc_type: 'loss_run',
        doc_type_confidence: 0.96,
        doc_type_reasoning:
          'Carrier loss run with claim listing, paid/incurred columns, and valuation date.',
        model: 'demo',
        daysAgo: 10,
        extractions: [
          {
            field_key: 'carrier',
            field_label: 'Carrier',
            value: 'Travelers Casualty & Surety',
            confidence: 0.99,
            source_note: 'Header',
            status: 'approved',
          },
          {
            field_key: 'valuation_date',
            field_label: 'Valuation date',
            value: '2026-03-15',
            confidence: 0.97,
            source_note: 'Header',
            status: 'approved',
          },
          {
            field_key: 'loss_history_years',
            field_label: 'Loss history period',
            value: '2024-01-01 through 2026-03-15',
            confidence: 0.94,
            source_note: 'Summary section',
            status: 'approved',
          },
          {
            field_key: 'total_claims',
            field_label: 'Open + closed claims',
            value: '4 claims (2 auto liability, 1 cargo, 1 WC med-only)',
            confidence: 0.91,
            source_note: 'Claim summary',
            status: 'approved',
          },
          {
            field_key: 'total_incurred',
            field_label: 'Total incurred',
            value: '$127,450',
            confidence: 0.92,
            source_note: 'Totals row',
            status: 'approved',
          },
          {
            field_key: 'largest_loss',
            field_label: 'Largest single loss',
            value: '$89,200 — rear-end liability (closed)',
            confidence: 0.87,
            source_note: 'Claim detail #2024-8841',
            status: 'pending',
          },
        ],
      },
      {
        filename: 'GL_Dec_Page_2026.pdf',
        mime_type: 'application/pdf',
        size_bytes: 98_400,
        doc_type: 'dec_page',
        doc_type_confidence: 0.98,
        doc_type_reasoning: 'Commercial GL declarations with policy number, limits, and premium.',
        model: 'demo',
        daysAgo: 9,
        extractions: [
          {
            field_key: 'policy_number',
            field_label: 'Policy number',
            value: 'CGL-8847291-03',
            confidence: 0.99,
            source_note: 'Dec page header',
            status: 'approved',
          },
          {
            field_key: 'gl_carrier',
            field_label: 'GL carrier',
            value: 'Hartford Fire Insurance Co.',
            confidence: 0.98,
            source_note: 'Dec page',
            status: 'approved',
          },
          {
            field_key: 'gl_premium',
            field_label: 'GL annual premium',
            value: '$18,420',
            confidence: 0.96,
            source_note: 'Premium summary',
            status: 'approved',
          },
          {
            field_key: 'deductible',
            field_label: 'Property damage deductible',
            value: '$2,500',
            confidence: 0.93,
            source_note: 'Deductible schedule',
            status: 'approved',
          },
        ],
      },
      {
        filename: 'COI_Warehouse_Lease_2026.pdf',
        mime_type: 'application/pdf',
        size_bytes: 72_300,
        doc_type: 'certificate_of_insurance',
        doc_type_confidence: 0.95,
        doc_type_reasoning: 'Certificate of liability insurance (ACORD 25) for additional insured.',
        model: 'demo',
        daysAgo: 8,
        extractions: [
          {
            field_key: 'certificate_holder',
            field_label: 'Certificate holder',
            value: 'Pacific Industrial REIT — Warehouse #7',
            confidence: 0.94,
            source_note: 'Certificate holder box',
            status: 'approved',
          },
          {
            field_key: 'coi_expiration',
            field_label: 'COI expiration',
            value: '2026-05-15',
            confidence: 0.96,
            source_note: 'Policy expiration dates',
            status: 'pending',
          },
          {
            field_key: 'additional_insured',
            field_label: 'Additional insured',
            value: 'Yes — blanket AI per lease requirement',
            confidence: 0.9,
            source_note: 'Description of operations',
            status: 'approved',
          },
        ],
      },
    ],
    analysis: {
      summary:
        'Maple Ridge Logistics is a regional freight broker and short-haul carrier renewing 4/1/2026. ' +
        'GL and auto are with Hartford/Travelers history; loss run shows moderate frequency with one ' +
        'large closed auto liability claim. Warehouse COI for Pacific Industrial REIT expires mid-May — ' +
        'confirm alignment with master policy dates before binding.',
      flags: [
        {
          type: 'expiring',
          severity: 'high',
          title: 'Warehouse COI expires before policy renewal',
          detail:
            'Certificate holder COI shows 5/15/2026 expiration while proposed renewal effective 4/1/2026. ' +
            'Gap may violate lease requirements if not reissued on renewal terms.',
          sourceDocuments: ['COI_Warehouse_Lease_2026.pdf'],
        },
        {
          type: 'inconsistent',
          severity: 'medium',
          title: 'GL occurrence limit differs between ACORD and dec page',
          detail:
            'ACORD lists $1M occurrence; prior dec page shows $2M occurrence on expiring term. Confirm intended limit with underwriter.',
          sourceDocuments: ['ACORD_125_Maple_Ridge_2026.pdf', 'GL_Dec_Page_2026.pdf'],
        },
        {
          type: 'missing',
          severity: 'low',
          title: 'Motor carrier filing not in packet',
          detail: 'No BMC-91 or MCP-65 filing evidence included for interstate operations.',
        },
      ],
      suggested_updates: [
        {
          field: 'Named insured',
          suggestedValue: 'Maple Ridge Logistics LLC',
          source: 'ACORD 125',
          sourceDocument: 'ACORD_125_Maple_Ridge_2026.pdf',
        },
        {
          field: 'Fleet schedule',
          suggestedValue: '18 tractors, 24 trailers (edited during review)',
          source: 'ACORD 125 + human review',
          sourceDocument: 'ACORD_125_Maple_Ridge_2026.pdf',
        },
        {
          field: 'Renewal effective',
          suggestedValue: '2026-04-01',
          source: 'ACORD 125',
        },
        {
          field: 'Loss run incurred',
          suggestedValue: '$127,450 total incurred (4 claims)',
          source: 'Travelers loss run',
          sourceDocument: 'Loss_Run_Travelers_2024-2026.pdf',
        },
      ],
      action_items: [
        {
          title: 'Confirm GL occurrence limit',
          detail: 'Reconcile $1M on ACORD vs $2M on expiring dec with carrier before quote bind.',
          priority: 'high',
        },
        {
          title: 'Reissue warehouse COI on renewal',
          detail: 'Pacific Industrial REIT requires AI and 30-day cancellation notice — schedule with Hartford.',
          priority: 'high',
        },
        {
          title: 'Request motor carrier filings',
          detail: 'Obtain BMC-91/MCP-65 if client operates interstate beyond OR/WA/ID.',
          priority: 'medium',
        },
      ],
      crm_export_block: `Account: Maple Ridge Logistics LLC
Status: Renewal in progress (eff. 4/1/2026)
Lines: GL, Auto, WC
Premium (expiring GL): $18,420
Loss experience: $127,450 incurred / 4 claims
Flags: COI expiration mismatch; GL limit discrepancy
Next step: Confirm limits + reissue warehouse COI`,
      model: 'demo',
      daysAgo: 7,
    },
  },
  {
    name: 'Smith Family',
    daysAgo: 8,
    documents: [
      {
        filename: 'Homeowners_Dec_Page_2026.pdf',
        mime_type: 'application/pdf',
        size_bytes: 64_200,
        doc_type: 'dec_page',
        doc_type_confidence: 0.97,
        doc_type_reasoning: 'Personal lines homeowners declarations page.',
        model: 'demo',
        daysAgo: 7,
        extractions: [
          {
            field_key: 'named_insured',
            field_label: 'Named insured',
            value: 'Robert & Sarah Smith',
            confidence: 0.98,
            source_note: 'Named insured line',
            status: 'approved',
          },
          {
            field_key: 'property_address',
            field_label: 'Property address',
            value: '742 Evergreen Terrace, Springfield, OR 97477',
            confidence: 0.97,
            source_note: 'Location of residence',
            status: 'approved',
          },
          {
            field_key: 'dwelling_limit',
            field_label: 'Dwelling limit (Coverage A)',
            value: '$485,000',
            confidence: 0.95,
            source_note: 'Coverage summary',
            status: 'approved',
          },
          {
            field_key: 'deductible',
            field_label: 'All-peril deductible',
            value: '$2,500',
            confidence: 0.96,
            source_note: 'Deductibles section',
            status: 'approved',
          },
          {
            field_key: 'annual_premium',
            field_label: 'Annual premium',
            value: '$1,842',
            confidence: 0.94,
            source_note: 'Premium total',
            status: 'approved',
          },
        ],
      },
      {
        filename: 'Personal_Auto_ID_Cards.pdf',
        mime_type: 'application/pdf',
        size_bytes: 41_500,
        doc_type: 'policy_document',
        doc_type_confidence: 0.89,
        doc_type_reasoning: 'Personal auto policy documents with vehicle schedule.',
        model: 'demo',
        daysAgo: 6,
        extractions: [
          {
            field_key: 'auto_carrier',
            field_label: 'Auto carrier',
            value: 'State Farm Mutual',
            confidence: 0.97,
            source_note: 'Policy header',
            status: 'approved',
          },
          {
            field_key: 'vehicles',
            field_label: 'Scheduled vehicles',
            value: '2019 Honda CR-V, 2022 Tesla Model 3',
            confidence: 0.92,
            source_note: 'Vehicle schedule',
            status: 'approved',
          },
          {
            field_key: 'auto_liability',
            field_label: 'Bodily injury limit',
            value: '$250,000 / $500,000',
            confidence: 0.93,
            source_note: 'Liability limits',
            status: 'pending',
          },
        ],
      },
    ],
  },
  {
    name: 'Harborview Medical Group',
    daysAgo: 5,
    documents: [
      {
        filename: 'Malpractice_Application_2026.pdf',
        mime_type: 'application/pdf',
        size_bytes: 312_000,
        doc_type: 'acord_application',
        doc_type_confidence: 0.94,
        doc_type_reasoning: 'Medical professional liability application with provider roster.',
        model: 'demo',
        daysAgo: 4,
        extractions: [
          {
            field_key: 'named_insured',
            field_label: 'Named insured',
            value: 'Harborview Medical Group PC',
            confidence: 0.98,
            source_note: 'Applicant name',
            status: 'approved',
          },
          {
            field_key: 'specialty',
            field_label: 'Primary specialty',
            value: 'Multi-specialty outpatient clinic (FM, ortho, derm)',
            confidence: 0.91,
            source_note: 'Operations description',
            status: 'pending',
          },
          {
            field_key: 'provider_count',
            field_label: 'Rendering providers',
            value: '14 physicians, 6 NPs/PAs',
            confidence: 0.88,
            source_note: 'Provider schedule',
            status: 'pending',
          },
          {
            field_key: 'malpractice_limit',
            field_label: 'Per claim / aggregate',
            value: '$1M / $3M',
            confidence: 0.94,
            source_note: 'Requested limits',
            status: 'approved',
          },
          {
            field_key: 'retro_date',
            field_label: 'Retroactive date',
            value: '2018-01-01',
            confidence: 0.96,
            source_note: 'Coverage part',
            status: 'approved',
          },
        ],
      },
      {
        filename: 'Prior_MPL_Dec_Page.pdf',
        mime_type: 'application/pdf',
        size_bytes: 88_100,
        doc_type: 'dec_page',
        doc_type_confidence: 0.96,
        doc_type_reasoning: 'Medical professional liability declarations.',
        model: 'demo',
        daysAgo: 3,
        extractions: [
          {
            field_key: 'expiring_carrier',
            field_label: 'Expiring carrier',
            value: 'ProAssurance Indemnity Co.',
            confidence: 0.97,
            source_note: 'Dec page',
            status: 'approved',
          },
          {
            field_key: 'expiring_premium',
            field_label: 'Expiring premium',
            value: '$42,680',
            confidence: 0.95,
            source_note: 'Premium line',
            status: 'approved',
          },
          {
            field_key: 'expiration_date',
            field_label: 'Expiration date',
            value: '2026-06-30',
            confidence: 0.98,
            source_note: 'Policy period',
            status: 'approved',
          },
        ],
      },
    ],
  },
]
