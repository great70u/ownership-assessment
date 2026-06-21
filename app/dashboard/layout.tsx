import { cookies } from 'next/headers'
import { Sidebar } from '@/components/shared/Sidebar'

async function getSessionUser() {
  const cookieStore = await cookies()
  const session = cookieStore.get('zinkro_session')
  if (!session?.value) return null
  try {
    return JSON.parse(Buffer.from(session.value, 'base64').toString('utf-8'))
  } catch {
    return null
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  return (
    <div className="min-h-screen bg-canvas flex">
      <Sidebar user={user} />
      <main className="flex-1 ml-[236px] min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
