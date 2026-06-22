'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Zap, Loader2, Check } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push('/onboarding')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Signup failed. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const FEATURES = [
    'Zero manual entry — AI reads your bank SMS alerts',
    'Track GTBank, Access Bank, Zenith and more',
    'Smart budgets that update automatically',
    'AI insights tailored to Nigerian spending patterns',
    'Goal tracking with auto-save rules',
  ]

  return (
    <div className="min-h-screen bg-[#070d1a] flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#081428] via-[#070d1a] to-[#070d1a]" />
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">Zinkro</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <p className="text-cyan-400 text-sm font-medium mb-4 tracking-wide uppercase">Built for Nigeria</p>
          <h1 className="text-5xl font-bold text-white leading-[1.1] mb-6">
            Your bank alerts<br />
            are trying to<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              tell you something.
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
            Zinkro listens. Every debit alert, every credit notification — automatically turned into clear insights about your financial health.
          </p>

          <div className="space-y-3.5">
            {FEATURES.map(f => (
              <div key={f} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-gray-300 text-sm leading-relaxed">{f}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-12 pt-8 border-t border-white/8">
            {[
              { value: '50,000+', label: 'Nigerians tracking wealth' },
              { value: '₦2.1B+', label: 'Transactions analysed' },
              { value: '4.9★', label: 'Average rating' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-white text-xl font-bold">{s.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 border-l-2 border-cyan-500/50 pl-5">
          <p className="text-gray-400 text-sm italic leading-relaxed">
            "I never knew where my salary was going. Zinkro showed me in 10 seconds. Now I'm saving ₦60,000 every month without trying."
          </p>
          <p className="text-gray-600 text-xs mt-2">— Emeka N., Abuja · Software Engineer</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold">Zinkro</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-gray-400 text-sm mb-8">Free forever. No credit card needed.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Tomi Bello"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.07] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.07] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Phone number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm shrink-0">
                  🇳🇬 <span>+234</span>
                </div>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="080 0000 0000"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.07] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Min. 6 characters"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Free Account'}
            </button>

            <p className="text-center text-gray-600 text-xs leading-relaxed">
              By creating an account you agree to our{' '}
              <a href="#" className="text-gray-500 hover:text-gray-400 underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-gray-500 hover:text-gray-400 underline">Privacy Policy</a>.
            </p>
          </form>

          <p className="text-center text-gray-600 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
