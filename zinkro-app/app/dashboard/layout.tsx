import { Sidebar } from '@/components/shared/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas flex">
      <Sidebar />
      <main className="flex-1 ml-[236px] min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
