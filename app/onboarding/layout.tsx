export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070d1a] flex items-center justify-center p-4">
      {children}
    </div>
  )
}
