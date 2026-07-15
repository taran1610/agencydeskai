export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-10">{children}</main>
    </div>
  )
}
