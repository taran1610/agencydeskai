export type UserRole = 'owner' | 'reviewer' | 'viewer'

export const ROLE_RANK: Record<UserRole, number> = {
  owner: 3,
  reviewer: 2,
  viewer: 1,
}

export function hasMinRole(role: UserRole, minimum: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum]
}

export function canWrite(role: UserRole): boolean {
  return hasMinRole(role, 'reviewer')
}

export function canReview(role: UserRole): boolean {
  return hasMinRole(role, 'reviewer')
}

export function canManageTeam(role: UserRole): boolean {
  return role === 'owner'
}

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  reviewer: 'Reviewer',
  viewer: 'Viewer',
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: 'Full access — manage team, upload, process, review, and export.',
  reviewer: 'Upload documents, process with AI, review and approve extractions.',
  viewer: 'Read-only access to accounts, documents, and analyses.',
}
