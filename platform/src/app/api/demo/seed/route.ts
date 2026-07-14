import { NextResponse } from 'next/server'
import { getAuthContext, isAuthContext, requireAuth } from '@/lib/auth/session'
import {
  ensureDemoDataForWorkspace,
  removeDemoData,
  seedDemoWorkspace,
  workspaceHasDemoData,
} from '@/lib/demo/seed'

export async function GET() {
  const auth = await getAuthContext()
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasDemo = await workspaceHasDemoData(auth.workspaceId)
  return NextResponse.json({ hasDemo })
}

export async function POST() {
  const auth = await requireAuth('reviewer')
  if (!isAuthContext(auth)) return auth

  try {
    const result = await seedDemoWorkspace(auth.workspaceId, auth.userId)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not load sample data' },
      { status: 500 },
    )
  }
}

export async function PUT() {
  const auth = await requireAuth('reviewer')
  if (!isAuthContext(auth)) return auth

  try {
    const result = await ensureDemoDataForWorkspace(auth.workspaceId, auth.userId)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not ensure sample data' },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  const auth = await requireAuth('owner')
  if (!isAuthContext(auth)) return auth

  try {
    const removed = await removeDemoData(auth.workspaceId, auth.userId)
    return NextResponse.json({ removed })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not remove sample data' },
      { status: 500 },
    )
  }
}
