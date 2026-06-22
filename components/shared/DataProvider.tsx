'use client'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useDataStore } from '@/store/dataStore'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const loaded = useDataStore((s) => s.loaded)
  const error = useDataStore((s) => s.error)
  const loadData = useDataStore((s) => s.loadData)

  useEffect(() => {
    loadData()
  }, [loadData])

  if (error && !loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-center px-6">
        <p className="text-error font-medium">Couldn&apos;t load your data</p>
        <p className="text-secondary text-sm max-w-md">{error}</p>
        <button
          onClick={() => useDataStore.getState().loadData()}
          className="mt-2 px-4 py-2 gradient-bg text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
        <p className="text-secondary text-sm">Loading your finances…</p>
      </div>
    )
  }

  return <>{children}</>
}
