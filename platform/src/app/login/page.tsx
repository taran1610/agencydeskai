import { FileSearch } from 'lucide-react'
import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center">
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
          <FileSearch size={20} />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">AgencyDesk AI</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to your operations console</p>
      </div>
      <LoginForm />
    </div>
  )
}
