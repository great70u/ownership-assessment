'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap, Check, ChevronRight, ChevronLeft, Loader2,
  MessageSquare, Shield, TrendingUp, TrendingDown, Target,
  PiggyBank, BarChart3, Phone, Mail, Copy, ArrowRight,
  CheckCircle2, Sparkles, AlertCircle,
} from 'lucide-react'

interface Props {
  firstName: string
  virtualNumber: string
}

const TOTAL_STEPS = 6

const BANKS = [
  { id: 'gtb', name: 'GTBank', color: '#FF6900' },
  { id: 'access', name: 'Access Bank', color: '#E31837' },
  { id: 'zenith', name: 'Zenith Bank', color: '#002060' },
  { id: 'uba', name: 'UBA', color: '#CC0000' },
  { id: 'firstbank', name: 'First Bank', color: '#00529B' },
  { id: 'fidelity', name: 'Fidelity Bank', color: '#008000' },
  { id: 'stanbic', name: 'Stanbic IBTC', color: '#009FE3' },
  { id: 'fcmb', name: 'FCMB', color: '#6F2080' },
  { id: 'sterling', name: 'Sterling Bank', color: '#C8102E' },
  { id: 'union', name: 'Union Bank', color: '#004B87' },
  { id: 'wema', name: 'Wema Bank', color: '#822789' },
  { id: 'kuda', name: 'Kuda Bank', color: '#60269E' },
  { id: 'opay', name: 'OPay', color: '#1DB954' },
  { id: 'polaris', name: 'Polaris Bank', color: '#002366' },
  { id: 'ecobank', name: 'Ecobank', color: '#002E6D' },
  { id: 'moniepoint', name: 'Moniepoint', color: '#0A2840' },
]

const INCOME_RANGES = [
  { id: 'lt100k', label: 'Below ₦100,000 / month' },
  { id: '100-300k', label: '₦100,000 – ₦300,000 / month' },
  { id: '300-500k', label: '₦300,000 – ₦500,000 / month' },
  { id: '500k-1m', label: '₦500,000 – ₦1,000,000 / month' },
  { id: 'gt1m', label: 'Above ₦1,000,000 / month' },
  { id: 'skip', label: 'Prefer not to say' },
]

const GOALS = [
  { id: 'track', label: 'Track my spending', icon: BarChart3, desc: 'See exactly where money goes' },
  { id: 'save', label: 'Save more money', icon: PiggyBank, desc: 'Build a consistent savings habit' },
  { id: 'budget', label: 'Stick to a budget', icon: Target, desc: 'Stop overspending on categories' },
  { id: 'debt', label: 'Reduce debt', icon: TrendingDown, desc: 'Pay off loans and cards faster' },
  { id: 'emergency', label: 'Emergency fund', icon: Shield, desc: 'Be ready for unexpected costs' },
  { id: 'invest', label: 'Invest & grow wealth', icon: TrendingUp, desc: 'Make money work for you' },
]

type IdentityType = 'bvn' | 'nin'

interface WizardData {
  banks: string[]
  incomeRange: string
  goals: string[]
  smsConnected: boolean
  identityType: IdentityType
  identityNumber: string
  identityVerified: boolean
  identitySkipped: boolean
}

function initData(): WizardData {
  return {
    banks: [],
    incomeRange: '',
    goals: [],
    smsConnected: false,
    identityType: 'bvn',
    identityNumber: '',
    identityVerified: false,
    identitySkipped: false,
  }
}

export function OnboardingWizard({ firstName, virtualNumber }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(initData)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [completing, setCompleting] = useState(false)
  const [copied, setCopied] = useState(false)

  function toggleBank(id: string) {
    setData(d => ({
      ...d,
      banks: d.banks.includes(id) ? d.banks.filter(b => b !== id) : [...d.banks, id],
    }))
  }

  function toggleGoal(id: string) {
    setData(d => ({
      ...d,
      goals: d.goals.includes(id) ? d.goals.filter(g => g !== id) : [...d.goals, id],
    }))
  }

  function canNext(): boolean {
    if (step === 2) return data.banks.length > 0
    if (step === 3) return data.incomeRange !== '' && data.goals.length > 0
    return true
  }

  function next() {
    if (canNext()) setStep(s => Math.min(s + 1, TOTAL_STEPS))
  }

  function back() {
    setStep(s => Math.max(s - 1, 1))
  }

  async function handleVerify() {
    const num = data.identityNumber.replace(/\s/g, '')
    if (num.length !== 11 || !/^\d+$/.test(num)) {
      setVerifyError('Please enter a valid 11-digit number.')
      return
    }
    setVerifyLoading(true)
    setVerifyError('')
    try {
      const res = await fetch(`/api/verify/${data.identityType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [data.identityType]: num }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Verification failed')
      setData(d => ({ ...d, identityVerified: true }))
    } catch (err: unknown) {
      setVerifyError(err instanceof Error ? err.message : 'Verification failed. Please try again.')
    } finally {
      setVerifyLoading(false)
    }
  }

  async function complete() {
    setCompleting(true)
    try {
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          banks: data.banks,
          incomeRange: data.incomeRange,
          goals: data.goals,
          smsConnected: data.smsConnected,
          identityVerified: data.identityVerified,
          identityType: data.identityVerified ? data.identityType : null,
        }),
      })
      router.push('/dashboard')
      router.refresh()
    } catch {
      setCompleting(false)
    }
  }

  function copyNumber() {
    navigator.clipboard.writeText(virtualNumber.replace(/\s/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  return (
    <div className="w-full max-w-[520px]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-white text-xl font-bold tracking-tight">Zinkro</span>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Step {step} of {TOTAL_STEPS}</span>
          <span className="text-xs text-gray-500">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      {step === 1 && <StepWelcome firstName={firstName} onNext={next} />}
      {step === 2 && (
        <StepBanks
          selected={data.banks}
          onToggle={toggleBank}
          onNext={next}
          onBack={back}
          canNext={canNext()}
        />
      )}
      {step === 3 && (
        <StepGoals
          incomeRange={data.incomeRange}
          goals={data.goals}
          onIncomeRange={v => setData(d => ({ ...d, incomeRange: v }))}
          onToggleGoal={toggleGoal}
          onNext={next}
          onBack={back}
          canNext={canNext()}
        />
      )}
      {step === 4 && (
        <StepSMS
          virtualNumber={virtualNumber}
          connected={data.smsConnected}
          copied={copied}
          onCopy={copyNumber}
          onConnected={() => setData(d => ({ ...d, smsConnected: true }))}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 5 && (
        <StepIdentity
          type={data.identityType}
          number={data.identityNumber}
          verified={data.identityVerified}
          loading={verifyLoading}
          error={verifyError}
          onTypeChange={t => setData(d => ({ ...d, identityType: t, identityNumber: '', identityVerified: false }))}
          onNumberChange={v => setData(d => ({ ...d, identityNumber: v, identityVerified: false }))}
          onVerify={handleVerify}
          onSkip={() => { setData(d => ({ ...d, identitySkipped: true })); next() }}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 6 && (
        <StepDone
          data={data}
          completing={completing}
          onComplete={complete}
        />
      )}
    </div>
  )
}

/* ─────────────────────────── Step 1: Welcome ─────────────────────────── */
function StepWelcome({ firstName, onNext }: { firstName: string; onNext: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <span className="text-cyan-400 text-sm font-medium">Welcome to Zinkro</span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">
        Hey {firstName}! 👋
      </h1>
      <p className="text-gray-400 text-base leading-relaxed mb-8">
        Let's personalize Zinkro for your financial life. This takes about <span className="text-white font-medium">2 minutes</span> and makes your tracking <span className="text-white font-medium">fully automatic</span>.
      </p>

      <div className="space-y-3 mb-10">
        {[
          { icon: MessageSquare, label: 'Bank SMS alerts auto-recorded', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { icon: Shield, label: 'Identity verified for advanced features', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: BarChart3, label: 'AI tailored to your spending patterns', color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { icon: TrendingUp, label: 'Goals that track your progress', color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map(({ icon: Icon, label, color, bg }) => (
          <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <span className="text-gray-300 text-sm">{label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
      >
        Let's get started
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

/* ─────────────────────────── Step 2: Banks ──────────────────────────── */
function StepBanks({
  selected, onToggle, onNext, onBack, canNext,
}: {
  selected: string[]
  onToggle: (id: string) => void
  onNext: () => void
  onBack: () => void
  canNext: boolean
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Which banks do you use?</h2>
      <p className="text-gray-400 text-sm mb-6">Select all that apply — we'll watch for their SMS alerts.</p>

      <div className="grid grid-cols-2 gap-2 mb-6 max-h-[340px] overflow-y-auto pr-1">
        {BANKS.map(bank => {
          const sel = selected.includes(bank.id)
          const initials = bank.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
          return (
            <button
              key={bank.id}
              onClick={() => onToggle(bank.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition ${
                sel
                  ? 'bg-blue-500/15 border-blue-500/50 text-white'
                  : 'bg-white/4 border-white/8 text-gray-300 hover:bg-white/8 hover:border-white/15'
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: sel ? '#3D7FFF' : '#1e2330' }}
              >
                {initials}
              </div>
              <span className="text-sm font-medium truncate">{bank.name}</span>
              {sel && <Check className="w-3.5 h-3.5 text-blue-400 ml-auto shrink-0" />}
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-blue-400 mb-4">{selected.length} bank{selected.length !== 1 ? 's' : ''} selected</p>
      )}

      <NavButtons onBack={onBack} onNext={onNext} canNext={canNext} nextLabel="Continue" />
    </div>
  )
}

/* ─────────────────────────── Step 3: Goals ──────────────────────────── */
function StepGoals({
  incomeRange, goals, onIncomeRange, onToggleGoal, onNext, onBack, canNext,
}: {
  incomeRange: string
  goals: string[]
  onIncomeRange: (v: string) => void
  onToggleGoal: (id: string) => void
  onNext: () => void
  onBack: () => void
  canNext: boolean
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Your income & goals</h2>
      <p className="text-gray-400 text-sm mb-6">This helps Zinkro AI give you better insights.</p>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Monthly income</label>
        <div className="space-y-2">
          {INCOME_RANGES.map(r => (
            <button
              key={r.id}
              onClick={() => onIncomeRange(r.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition ${
                incomeRange === r.id
                  ? 'bg-blue-500/15 border-blue-500/50 text-white'
                  : 'bg-white/4 border-white/8 text-gray-300 hover:bg-white/8'
              }`}
            >
              <span>{r.label}</span>
              {incomeRange === r.id && <Check className="w-4 h-4 text-blue-400" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Financial goals <span className="text-gray-600 lowercase normal-case">(pick any)</span></label>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map(({ id, label, icon: Icon, desc }) => {
            const sel = goals.includes(id)
            return (
              <button
                key={id}
                onClick={() => onToggleGoal(id)}
                className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left transition ${
                  sel
                    ? 'bg-blue-500/15 border-blue-500/50'
                    : 'bg-white/4 border-white/8 hover:bg-white/8'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-4 h-4 ${sel ? 'text-blue-400' : 'text-gray-500'}`} />
                  {sel && <Check className="w-3 h-3 text-blue-400" />}
                </div>
                <span className={`text-xs font-semibold leading-tight ${sel ? 'text-white' : 'text-gray-300'}`}>{label}</span>
                <span className="text-[11px] text-gray-500 leading-tight">{desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} canNext={canNext} nextLabel="Continue" />
    </div>
  )
}

/* ─────────────────────────── Step 4: SMS ────────────────────────────── */
function StepSMS({
  virtualNumber, connected, copied, onCopy, onConnected, onNext, onBack,
}: {
  virtualNumber: string
  connected: boolean
  copied: boolean
  onCopy: () => void
  onConnected: () => void
  onNext: () => void
  onBack: () => void
}) {
  const [testSms, setTestSms] = useState('')
  const [testResult, setTestResult] = useState<{ name: string; amount: number; type: string } | null>(null)
  const [testing, setTesting] = useState(false)

  async function testParse() {
    if (!testSms.trim()) return
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/ai/parse-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smsText: testSms }),
      })
      if (res.ok) {
        const { transaction } = await res.json()
        setTestResult(transaction)
        onConnected()
      }
    } finally {
      setTesting(false)
    }
  }

  return (
    <div>
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center mb-4">
        <MessageSquare className="w-6 h-6 text-cyan-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-1">Connect your bank SMS alerts</h2>
      <p className="text-gray-400 text-sm mb-6">
        Never enter a transaction manually. Zinkro reads your bank alerts and records them automatically.
      </p>

      {/* How it works */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { icon: Phone, label: 'Bank sends SMS' },
          { label: '→', icon: null },
          { icon: MessageSquare, label: 'Forward to Zinkro' },
          { label: '→', icon: null },
          { icon: Check, label: 'Auto-recorded' },
        ].map((item, i) =>
          item.icon
            ? <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400"><item.icon className="w-3.5 h-3.5 text-cyan-400" />{item.label}</div>
            : <span key={i} className="text-gray-600 text-xs">{item.label}</span>
        )}
      </div>

      {/* Virtual number */}
      <div className="bg-white/4 border border-white/10 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500 mb-1">Your Zinkro SMS number</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-white font-mono text-xl font-bold tracking-wide">{virtualNumber}</span>
          <button
            onClick={onCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs hover:bg-blue-500/25 transition"
          >
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white/4 border border-white/8 rounded-xl p-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">How to connect (Android)</p>
        <ol className="space-y-2">
          {[
            'Save the Zinkro number to your contacts',
            'When you receive a bank debit or credit alert, long-press the SMS',
            'Tap "Forward" and select your Zinkro contact',
            'Zinkro AI reads it and records the transaction instantly',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
              <span className="w-5 h-5 rounded-full bg-white/8 flex items-center justify-center text-[10px] text-gray-500 shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Test it now */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Test it now — paste any bank SMS</p>
        <textarea
          value={testSms}
          onChange={e => setTestSms(e.target.value)}
          placeholder="Paste a bank alert here, e.g. 'Acct 0123456789 Debited NGN 5,000.00 on 22-Jun-26...'"
          className="w-full h-20 bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-none"
        />
        {testSms.trim() && (
          <button
            onClick={testParse}
            disabled={testing}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs hover:bg-cyan-500/25 transition disabled:opacity-50"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {testing ? 'Parsing...' : 'Parse this SMS'}
          </button>
        )}
        {testResult && (
          <div className="mt-3 p-3 rounded-xl bg-green-500/10 border border-green-500/25">
            <p className="text-green-400 text-xs font-semibold mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Parsed successfully!
            </p>
            <p className="text-gray-300 text-xs">
              {testResult.type === 'DEBIT' ? '↓ Debit' : '↑ Credit'} · <span className="text-white font-medium">₦{testResult.amount?.toLocaleString()}</span> · {testResult.name}
            </p>
          </div>
        )}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} canNext skipLabel="Skip for now" onSkip={onNext} />
    </div>
  )
}

/* ─────────────────────────── Step 5: Identity ───────────────────────── */
function StepIdentity({
  type, number, verified, loading, error,
  onTypeChange, onNumberChange, onVerify, onSkip, onNext, onBack,
}: {
  type: IdentityType
  number: string
  verified: boolean
  loading: boolean
  error: string
  onTypeChange: (t: IdentityType) => void
  onNumberChange: (v: string) => void
  onVerify: () => void
  onSkip: () => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div>
      <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-4">
        <Shield className="w-6 h-6 text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-1">Verify your identity</h2>
      <p className="text-gray-400 text-sm mb-2">
        Optional but recommended — unlocks advanced features like account linking and spending limits.
      </p>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/8 border border-blue-500/20 mb-6">
        <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-300 leading-relaxed">
          Your BVN/NIN is encrypted and never shared. We only use it to verify you are who you say you are.
        </p>
      </div>

      {/* BVN / NIN toggle */}
      <div className="flex gap-2 mb-5">
        {(['bvn', 'nin'] as IdentityType[]).map(t => (
          <button
            key={t}
            onClick={() => onTypeChange(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${
              type === t
                ? 'bg-blue-500/20 border-blue-500/50 text-white'
                : 'bg-white/4 border-white/8 text-gray-400 hover:bg-white/8'
            }`}
          >
            {t.toUpperCase()}
            <span className="block text-[10px] font-normal mt-0.5 text-gray-500">
              {t === 'bvn' ? 'Bank Verification Number' : 'National Identity Number'}
            </span>
          </button>
        ))}
      </div>

      {!verified ? (
        <>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Enter your {type.toUpperCase()} (11 digits)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={11}
                value={number}
                onChange={e => onNumberChange(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="00000000000"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center tracking-[0.25em] text-lg font-mono placeholder-gray-700 focus:outline-none focus:border-blue-500/60 transition"
              />
              <button
                onClick={onVerify}
                disabled={loading || number.length !== 11}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/25 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <div>
            <p className="text-green-400 text-sm font-semibold">{type.toUpperCase()} Verified!</p>
            <p className="text-gray-400 text-xs mt-0.5">Your identity is confirmed. Full features unlocked.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center text-gray-400 hover:bg-white/8 transition shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={verified ? onNext : onSkip}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          {verified ? 'Continue' : 'Skip for now'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {!verified && (
        <p className="text-center text-xs text-gray-600 mt-3">You can verify later in Settings</p>
      )}
    </div>
  )
}

/* ─────────────────────────── Step 6: Done ───────────────────────────── */
function StepDone({ data, completing, onComplete }: { data: WizardData; completing: boolean; onComplete: () => void }) {
  const banksSetup = data.banks.length
  const goalsSet = data.goals.length

  const summaryItems = [
    { label: `${banksSetup} bank${banksSetup !== 1 ? 's' : ''} connected`, done: banksSetup > 0, icon: CheckCircle2 },
    { label: `${goalsSet} financial goal${goalsSet !== 1 ? 's' : ''} set`, done: goalsSet > 0, icon: CheckCircle2 },
    { label: 'SMS auto-recording active', done: data.smsConnected, icon: data.smsConnected ? CheckCircle2 : AlertCircle },
    { label: 'Identity verified', done: data.identityVerified, icon: data.identityVerified ? CheckCircle2 : AlertCircle },
  ]

  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
        <Sparkles className="w-9 h-9 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">You're all set!</h2>
      <p className="text-gray-400 mb-8 max-w-sm mx-auto">
        Zinkro is ready to track your finances. Here's what we've set up:
      </p>

      <div className="space-y-2.5 mb-8 text-left">
        {summaryItems.map(({ label, done, icon: Icon }) => (
          <div
            key={label}
            className={`flex items-center gap-3 p-3 rounded-xl border ${
              done
                ? 'bg-green-500/8 border-green-500/20'
                : 'bg-white/4 border-white/8 opacity-60'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${done ? 'text-green-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${done ? 'text-gray-200' : 'text-gray-500'}`}>{label}</span>
            {!done && <span className="ml-auto text-[10px] text-gray-600">Set up later</span>}
          </div>
        ))}

        <div className="flex items-center gap-3 p-3 rounded-xl border bg-blue-500/8 border-blue-500/20">
          <Mail className="w-4 h-4 shrink-0 text-blue-400" />
          <span className="text-sm text-gray-300">Email alerts — connect in Settings</span>
          <span className="ml-auto text-[10px] text-blue-400">Soon</span>
        </div>
      </div>

      <button
        onClick={onComplete}
        disabled={completing}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-base hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
      >
        {completing ? <><Loader2 className="w-5 h-5 animate-spin" /> Setting up...</> : <>Go to my dashboard <ArrowRight className="w-5 h-5" /></>}
      </button>
    </div>
  )
}

/* ─────────────────────────── Nav Buttons ────────────────────────────── */
function NavButtons({
  onBack, onNext, canNext = true, nextLabel = 'Continue', skipLabel, onSkip,
}: {
  onBack: () => void
  onNext: () => void
  canNext?: boolean
  nextLabel?: string
  skipLabel?: string
  onSkip?: () => void
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center text-gray-400 hover:bg-white/8 transition shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {skipLabel && onSkip && (
        <button
          onClick={onSkip}
          className="w-full mt-3 text-center text-xs text-gray-600 hover:text-gray-400 transition"
        >
          {skipLabel}
        </button>
      )}
    </div>
  )
}
