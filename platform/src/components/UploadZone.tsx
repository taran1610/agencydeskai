'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'

export function UploadZone({ accountId }: { accountId: string }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function upload(files: FileList | File[]) {
    const list = Array.from(files)
    if (list.length === 0) return
    setBusy(true)
    setMessage(null)
    try {
      const form = new FormData()
      form.set('accountId', accountId)
      for (const file of list) form.append('files', file)
      const response = await fetch('/api/documents', { method: 'POST', body: form })
      const data = await response.json()
      if (!response.ok && !data.uploaded?.length) {
        throw new Error(data.rejected?.[0]?.reason ?? data.error ?? 'Upload failed')
      }
      const parts = [`${data.uploaded.length} uploaded`]
      if (data.rejected?.length) {
        parts.push(
          `${data.rejected.length} rejected (${data.rejected
            .map((r: { filename: string; reason: string }) => `${r.filename}: ${r.reason}`)
            .join('; ')})`,
        )
      }
      setMessage(parts.join(' · '))
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          upload(event.dataTransfer.files)
        }}
        disabled={busy}
        className={`flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-sm transition ${
          dragging
            ? 'border-slate-500 bg-slate-100'
            : 'border-slate-300 bg-white hover:border-slate-400'
        } disabled:opacity-60`}
      >
        <UploadCloud size={22} className="text-slate-400" />
        <span className="font-medium text-slate-700">
          {busy ? 'Uploading…' : 'Drop documents here or click to browse'}
        </span>
        <span className="text-xs text-slate-400">
          PDF, PNG, JPEG, WebP · up to 30 MB each · multiple files supported
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="application/pdf,image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => event.target.files && upload(event.target.files)}
      />
      {message && <p className="mt-2 text-xs text-slate-500">{message}</p>}
    </div>
  )
}
