import type { AccountAnalysis, AnalysisFlag, SuggestedUpdate } from '@/lib/types'

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 } as const

export function sortFlagsBySeverity(flags: AnalysisFlag[]): AnalysisFlag[] {
  return [...flags].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
}

export function formatCrmExportBlock(
  accountName: string,
  summary: string,
  updates: SuggestedUpdate[],
): string {
  const lines = [
    `=== AgencyDesk AI — CRM Update Draft ===`,
    `Account: ${accountName}`,
    `Generated: ${new Date().toLocaleString()}`,
    ``,
    `--- SUMMARY ---`,
    summary,
    ``,
  ]
  if (updates.length > 0) {
    lines.push(`--- SUGGESTED FIELD UPDATES ---`)
    for (const update of updates) {
      lines.push(`${update.field}: ${update.suggestedValue}`)
      lines.push(`  Source: ${update.source}`)
      if (update.sourceDocument) lines.push(`  Document: ${update.sourceDocument}`)
      if (update.sourceSection) lines.push(`  Section: ${update.sourceSection}`)
      lines.push(``)
    }
  }
  lines.push(`--- END ---`)
  lines.push(`Reviewed and approved by: _______________`)
  return lines.join('\n')
}

export interface AnalysisDiff {
  summaryChanged: boolean
  newFlags: AnalysisFlag[]
  resolvedFlags: AnalysisFlag[]
  newUpdates: SuggestedUpdate[]
  changedUpdates: { field: string; from: string; to: string }[]
}

export function diffAnalyses(
  previous: AccountAnalysis | null,
  current: AccountAnalysis,
): AnalysisDiff | null {
  if (!previous) return null

  const prevFlagTitles = new Set(previous.flags.map((f) => f.title))
  const currFlagTitles = new Set(current.flags.map((f) => f.title))

  const newFlags = current.flags.filter((f) => !prevFlagTitles.has(f.title))
  const resolvedFlags = previous.flags.filter((f) => !currFlagTitles.has(f.title))

  const prevUpdates = new Map(previous.suggested_updates.map((u) => [u.field, u.suggestedValue]))
  const newUpdates = current.suggested_updates.filter((u) => !prevUpdates.has(u.field))
  const changedUpdates = current.suggested_updates
    .filter((u) => prevUpdates.has(u.field) && prevUpdates.get(u.field) !== u.suggestedValue)
    .map((u) => ({
      field: u.field,
      from: prevUpdates.get(u.field)!,
      to: u.suggestedValue,
    }))

  return {
    summaryChanged: previous.summary !== current.summary,
    newFlags,
    resolvedFlags,
    newUpdates,
    changedUpdates,
  }
}
