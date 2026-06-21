'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Zap, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDemo() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'tomi.bello@zinkro.demo', password: 'demo' }),
    })
    if (res.ok) {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#070d1a] flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-14 overflow-hidden">
        {/* ambient glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f3c] via-[#070d1a] to-[#070d1a]" />
        <div className="absolute top-[-120px] left-[-80px] w-[480px] h-[480px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">Zinkro</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <p className="text-blue-400 text-sm font-medium mb-4 tracking-wide uppercase">AI-Powered Personal Finance</p>
          <h1 className="text-5xl font-bold text-white leading-[1.1] mb-6">
            Your money.<br />
            Your story.<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Finally clear.
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
            Zinkro reads your bank alerts so you don't have to. Track spending across all your Nigerian accounts — zero manual entry.
          </p>

          <div className="space-y-4">
            {[
              { icon: '🤖', label: 'AI reads GTBank, Access Bank & Zenith alerts' },
              { icon: '📊', label: 'See all accounts in one beautiful dashboard' },
              { icon: '🎯', label: 'Set savings goals and watch your wealth grow' },
              { icon: '🔒', label: 'Bank-grade encryption for your financial data' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3.5">
                <span className="text-xl w-8 text-center">{f.icon}</span>
                <span className="text-gray-300 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 border-l-2 border-blue-500/50 pl-5">
          <p className="text-gray-400 text-sm italic leading-relaxed">
            "Zinkro showed me I was spending ₦42,000 monthly on food delivery.
            I've saved ₦180,000 in three months since switching."
          </p>
          <p className="text-gray-600 text-xs mt-2">— Adaeze O., Lagos · Product Designer</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold">Zinkro</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-8">Sign in to your Zinkro account</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.07] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.07] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#070d1a] text-gray-600 text-xs">or</span>
            </div>
          </div>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="w-full py-3 rounded-xl border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5 hover:border-white/20 transition disabled:opacity-50"
          >
            Try demo account — no sign up needed
          </button>

          <p className="text-center text-gray-600 text-sm mt-8">
            New to Zinkro?{' '}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
