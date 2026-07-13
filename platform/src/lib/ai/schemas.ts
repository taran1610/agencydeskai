import { z } from 'zod'

export const docTypeEnum = z.enum([
  'acord_application',
  'loss_run',
  'dec_page',
  'certificate_of_insurance',
  'policy_document',
  'endorsement',
  'quote',
  'correspondence',
  'other',
])

export const documentReadSchema = z.object({
  classification: z.object({
    docType: docTypeEnum,
    confidence: z
      .number()
      .min(0)
      .max(1)
      .describe('How confident you are in the document type, 0 to 1'),
    reasoning: z.string().describe('One sentence on why you chose this type'),
  }),
  fields: z
    .array(
      z.object({
        key: z
          .string()
          .describe('snake_case identifier, e.g. insured_name, policy_number'),
        label: z.string().describe('Human-readable label, e.g. "Insured name"'),
        value: z.string().describe('The extracted value exactly as it appears'),
        confidence: z
          .number()
          .min(0)
          .max(1)
          .describe(
            'Extraction confidence. Lower it for handwriting, poor scans, ambiguity.',
          ),
        sourceNote: z
          .string()
          .describe(
            'Where in the document this came from, e.g. "Page 1, Declarations section"',
          ),
      }),
    )
    .describe('Every material field found in the document'),
})

export type DocumentRead = z.infer<typeof documentReadSchema>

export const accountAnalysisSchema = z.object({
  summary: z
    .string()
    .describe(
      'A clean 2-4 paragraph account summary an account manager could paste into the CRM: who the insured is, coverages, carriers, key dates, loss history.',
    ),
  flags: z.array(
    z.object({
      type: z.enum(['missing', 'inconsistent', 'expiring', 'other']),
      severity: z.enum(['high', 'medium', 'low']),
      title: z.string(),
      detail: z
        .string()
        .describe('What is wrong or missing and which documents are involved'),
      sourceDocuments: z
        .array(z.string())
        .optional()
        .describe('Filenames of documents involved in this flag'),
    }),
  ),
  suggestedUpdates: z
    .array(
      z.object({
        field: z.string().describe('CRM field name, e.g. "Policy expiration"'),
        suggestedValue: z.string(),
        source: z.string().describe('Which document and section supports this'),
        sourceDocument: z.string().optional().describe('Filename of source document'),
        sourceSection: z.string().optional().describe('Section or page in the document'),
      }),
    )
    .describe('Concrete CRM field updates for a human to approve'),
  actionItems: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
    }),
  ),
  crmExportBlock: z
    .string()
    .describe(
      'A ready-to-paste CRM update block: account summary plus every suggested field update with sources, formatted for copy-paste into an AMS notes field.',
    ),
})

export type AccountAnalysisResult = z.infer<typeof accountAnalysisSchema>
