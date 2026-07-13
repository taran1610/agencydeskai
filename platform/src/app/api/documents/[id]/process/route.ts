import { NextResponse } from 'next/server'
import { processDocument } from '@/lib/pipeline'

export const maxDuration = 300

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const document = await processDocument(id)
    return NextResponse.json({ document })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Processing failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
