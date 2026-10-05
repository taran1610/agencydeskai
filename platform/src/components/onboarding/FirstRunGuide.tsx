'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileUp,
  Sparkles,
  UserPlus,
  X,
} from 'lucide-react'

const STEPS = [
  {
    eyebrow: 'Welcome',
    title: 'Your workspace is empty and ready',
    body: 'There is no sample data here. AgencyDesk reads insurance files, pulls out the fields, and waits for you to approve them before anything is exported.',
    icon: Sparkles,
  },
  {
    eyebrow: 'Step 1',
    title: 'Add your first client',
    body: 'Create one account per insured. A name is enough to start — you can upload their documents on the next screen.',
    icon: UserPlus,
  },
  {
    eyebrow: 'Step 2',
    title: 'Upload the document packet',
    body: 'Drop in ACORDs, loss runs, dec pages, and certificates. PDFs and scans both work.',
    icon: FileUp,
  },
  {
    eyebrow: 'Step 3',
    title: 'Let AI read the file',
    body: 'Process the documents from the client account. Each file is classified, and every material field comes back with a confidence score.',
    icon: Sparkles,
  },
  {
    eyebrow: 'Step 4',
    title: 'You approve, then export',
    body: 'Review each field — approve, edit, or reject it. Then copy the CRM update or download a CSV. Nothing leaves the workspace until you say so.',
    icon: CheckCircle2,
  },
] as const

function storageKey(workspaceId: string) {
  return `agencydesk:first-run:${workspaceId}`
}

export function FirstRunGuide({
  workspaceId,
  show,
  canCreate,
}: {
  workspaceId: string
  show: boolean
  canCreate: boolean
}) {
  const [closed, setClosed] = useState(false)
  const [step, setStep] = useState(0)
  const seen = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return localStorage.getItem(storageKey(workspaceId)) === '1'
      } catch {
        return false
      }
    },
    () => false,
  )
  const open = show && !seen && !closed

  const finish = useCallback(() => {
    try {
      localStorage.setItem(storageKey(workspaceId), '1')
    } catch {
      // Ignore storage failures; the guide simply shows again next visit.
    }
    setClosed(true)
    document.getElementById('start-here')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [workspaceId])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, finish])

  if (!open) return null

  const current = STEPS[step]
  const Icon = current.icon
  const last = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close welcome guide"
        onClick={finish}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-run-title"
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gray-500)]">
            {step + 1} of {STEPS.length}
          </p>
          <button
            type="button"
            onClick={finish}
            className="rounded-md p-1 text-[var(--gray-400)] hover:bg-[var(--gray-100)] hover:text-black"
            aria-label="Skip guide"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 pb-2 pt-4">
          <div className="mb-5 flex gap-1.5" aria-hidden>
            {STEPS.map((item, index) => (
              <span
                key={item.title}
                className={`h-1 flex-1 rounded-full ${index <= step ? 'bg-black' : 'bg-[var(--gray-200)]'}`}
              />
            ))}
          </div>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
            <Icon size={20} strokeWidth={1.75} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gray-500)]">
            {current.eyebrow}
          </p>
          <h2 id="first-run-title" className="mt-1 text-xl font-semibold tracking-tight text-black">
            {current.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--gray-600)]">{current.body}</p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--border)] px-6 py-4">
          <button
            type="button"
            onClick={finish}
            className="text-xs font-semibold text-[var(--gray-500)] hover:text-black"
          >
            Skip for now
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button type="button" onClick={() => setStep((value) => value - 1)} className="console-btn-secondary">
                <ArrowLeft size={14} />
                Back
              </button>
            )}
            {last ? (
              <button type="button" onClick={finish} className="console-btn-primary">
                {canCreate ? 'Create your first client' : 'Got it'}
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((value) => value + 1)}
                className="console-btn-primary"
              >
                Next
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
