import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { PageHeader } from '@/components/console/PageHeader'
import { ReviewQueue } from '@/components/sections/ReviewQueue'
import { requireConsolePage } from '@/lib/console-page'
import { listPendingReviewExtractions } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function ReviewPage() {
  const result = await requireConsolePage()
  if ('noWorkspace' in result) {
    return <NoWorkspaceAccess email={result.noWorkspace} />
  }
  const { auth, canCreate } = result

  const extractions = await listPendingReviewExtractions(auth.workspaceId)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        role={auth.role}
        section="Review & approval"
        title="Review queue"
        description="Every extracted field must be approved, edited, or rejected by a human before it goes to CRM."
      />
      <ReviewQueue extractions={extractions} canReview={canCreate} />
    </div>
  )
}
