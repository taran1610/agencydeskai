import { CheckCircle2, FileUp, Sparkles, UserPlus } from 'lucide-react'
import { NewAccountForm } from '@/components/NewAccountForm'

const STEPS = [
  {
    title: 'Create a client account',
    body: 'One account per insured. Start with the name — you will land on their file next.',
    icon: UserPlus,
  },
  {
    title: 'Upload the document packet',
    body: 'ACORDs, loss runs, dec pages, and certificates. PDF or a scanned image.',
    icon: FileUp,
  },
  {
    title: 'Process with AI',
    body: 'From the client file, process the documents. Fields come back with confidence scores.',
    icon: Sparkles,
  },
  {
    title: 'Review, then export',
    body: 'Approve, edit, or reject each field. Copy the CRM update or download a CSV when you are done.',
    icon: CheckCircle2,
  },
] as const

export function StartHere({ canCreate }: { canCreate: boolean }) {
  return (
    <section id="start-here" className="dash-card overflow-hidden">
      <div className="border-b border-[var(--border)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gray-500)]">
          First time here
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-black">
          Four steps to your first client file
        </h2>
        <p className="mt-1 max-w-xl text-sm text-[var(--gray-500)]">
          Work through them in order. You can leave and come back — your progress is the work you
          save in this workspace.
        </p>
      </div>
      <ol className="divide-y divide-[var(--border)]">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const active = index === 0
          return (
            <li key={step.title} className="flex gap-4 px-6 py-5">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  active ? 'bg-black text-white' : 'border border-[var(--border)] text-[var(--gray-500)]'
                }`}
              >
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-[var(--gray-500)]" strokeWidth={1.75} />
                  <p className="text-sm font-semibold text-black">{step.title}</p>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--gray-500)]">{step.body}</p>
                {active && (
                  <div className="mt-4 max-w-xl">
                    {canCreate ? (
                      <NewAccountForm />
                    ) : (
                      <p className="text-sm text-[var(--gray-600)]">
                        Ask a workspace owner to create the first client account. You can follow
                        along once it exists.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
