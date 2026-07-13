import { NextResponse } from 'next/server'
import { isAuthContext, requireAuth } from '@/lib/auth/session'
import { buildAnalysisReportHtml, buildExtractionsCsv } from '@/lib/export'
import { getAccountDetail } from '@/lib/data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth('viewer')
  if (!isAuthContext(auth)) return auth

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') ?? 'csv'

  const detail = await getAccountDetail(id, auth.workspaceId)
  if (!detail) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  const { account, documents, extractions, analyses } = detail
  const latestAnalysis = analyses[0] ?? null

  if (format === 'html' || format === 'pdf') {
    if (!latestAnalysis) {
      return NextResponse.json({ error: 'No analysis to export' }, { status: 400 })
    }
    const html = buildAnalysisReportHtml(account, latestAnalysis)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${account.name.replace(/[^\w.-]/g, '_')}-report.html"`,
      },
    })
  }

  const csv = buildExtractionsCsv(account, documents, extractions)
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${account.name.replace(/[^\w.-]/g, '_')}-extractions.csv"`,
    },
  })
}
