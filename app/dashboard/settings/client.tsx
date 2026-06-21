'use client'
import { useState } from 'react'
import { DEMO_ACCOUNTS } from '@/lib/demo-store'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  User, Link2, CreditCard, Share2, Shield,
  CheckCircle2, Crown, Moon, Copy, Check,
  Eye, EyeOff, Loader2, Smartphone, LogOut,
  Trash2, ChevronRight,
} from 'lucide-react'

interface SessionUser {
  name: string
  email: string
  phone?: string
}

const SECTIONS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'accounts', icon: Link2, label: 'Connected Accounts' },
  { id: 'subscription', icon: CreditCard, label: 'Subscription' },
  { id: 'refer', icon: Share2, label: 'Refer & Earn' },
  { id: 'security', icon: Shield, label: 'Security' },
]

export function SettingsClient({ user }: { user: SessionUser | null }) {
  const [active, setActive] = useState('profile')
  const [darkMode, setDarkMode] = useState(true)
  const [copied, setCopied] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const displayName = user?.name || 'Demo User'
  const displayEmail = user?.email || 'demo@zinkro.app'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const referralCode = 'ZINKRO-' + displayEmail.split('@')[0].slice(0, 4).toUpperCase()

  function copyReferral() {
    navigator.clipboard.writeText(referralCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setProfileLoading(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    setPwLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setPwLoading(false)
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 3000)
  }

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <h1 className="text-2xl font-display font-bold text-primary mb-6">Settings</h1>

      <div className="grid grid-cols-[200px_1fr] gap-6">
        {/* Left nav */}
        <div className="space-y-1">
          {SECTIONS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors text-left ${
                active === id
                  ? 'bg-accent/15 text-accent'
                  : 'text-secondary hover:text-primary hover:bg-surface2'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-5">

          {/* ── Profile ── */}
          {active === 'profile' && (
            <Card>
              <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">{displayName}</h3>
                    <p className="text-sm text-secondary">{displayEmail}</p>
                    <Badge variant="success" className="mt-1">Health Score: 78</Badge>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Full Name</label>
                      <input
                        defaultValue={displayName}
                        className="w-full px-3 py-2.5 rounded-md bg-surface2 border border-border text-primary text-sm focus:outline-none focus:border-accent/50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Email</label>
                      <input
                        defaultValue={displayEmail}
                        type="email"
                        className="w-full px-3 py-2.5 rounded-md bg-surface2 border border-border text-primary text-sm focus:outline-none focus:border-accent/50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Phone</label>
                      <input
                        defaultValue={user?.phone || ''}
                        placeholder="+234 800 000 0000"
                        className="w-full px-3 py-2.5 rounded-md bg-surface2 border border-border text-primary text-sm focus:outline-none focus:border-accent/50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Member Since</label>
                      <input
                        defaultValue="June 2026"
                        disabled
                        className="w-full px-3 py-2.5 rounded-md bg-surface2 border border-border text-secondary text-sm opacity-60"
                      />
                    </div>
                  </div>

                  {/* Preferences inline */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <p className="text-sm font-medium text-primary">Preferences</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Moon className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-sm text-primary">Dark Mode</p>
                          <p className="text-xs text-secondary">Currently {darkMode ? 'on' : 'off'}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDarkMode(v => !v)}
                        className={`w-10 h-6 rounded-full flex items-center transition-colors ${darkMode ? 'bg-success' : 'bg-border'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow mx-1 transition-transform ${darkMode ? 'translate-x-4' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="px-5 py-2.5 gradient-bg text-white text-sm font-medium rounded-md hover:opacity-90 transition flex items-center gap-2"
                    >
                      {profileLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> : 'Save Changes'}
                    </button>
                    {profileSaved && (
                      <div className="flex items-center gap-1.5 text-success text-sm">
                        <Check className="w-4 h-4" /> Saved!
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* ── Connected Accounts ── */}
          {active === 'accounts' && (
            <Card>
              <CardHeader><CardTitle>Connected Accounts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-secondary mb-1">Banks connected to your Zinkro account. Transactions sync automatically via SMS alerts.</p>
                {DEMO_ACCOUNTS.map(acc => (
                  <div key={acc.id} className="flex items-center gap-3 bg-surface2 rounded-md p-3">
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: acc.color }}
                    >
                      {acc.bankName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary">{acc.bankName}</p>
                      <p className="text-xs text-secondary">••••{acc.accountNumber.slice(-4)} · {acc.accountType}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-primary">{formatCurrency(acc.balance)}</p>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        <span className="text-xs text-success">Synced</span>
                      </div>
                    </div>
                    <button className="text-secondary hover:text-red-400 transition ml-2 shrink-0" title="Remove account">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border rounded-md text-sm text-secondary hover:text-accent hover:border-accent/50 transition-colors mt-2">
                  + Add another bank
                </button>
                <div className="bg-surface2 rounded-md p-4 mt-2">
                  <p className="text-xs font-medium text-primary mb-1">How it works</p>
                  <p className="text-xs text-secondary leading-relaxed">
                    Forward your bank SMS alerts to Zinkro and our AI will automatically categorise every transaction. Your account credentials are never stored.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Subscription ── */}
          {active === 'subscription' && (
            <Card>
              <CardHeader><CardTitle>Subscription</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="border-2 border-accent rounded-lg p-4 relative">
                    <Badge variant="default" className="absolute -top-2.5 left-3">Current Plan</Badge>
                    <p className="text-sm font-semibold text-primary mt-2">Free</p>
                    <p className="text-2xl font-display font-bold text-primary my-1">₦0<span className="text-sm font-normal text-secondary">/mo</span></p>
                    <ul className="text-xs text-secondary space-y-1.5 mt-3">
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-success" /> 3 connected accounts</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-success" /> Basic AI insights</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-success" /> 6 budget categories</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-success" /> 3 savings goals</li>
                    </ul>
                  </div>
                  <div className="bg-surface2 border border-border rounded-lg p-4 relative">
                    <div className="absolute -top-2.5 left-3 flex items-center gap-1 bg-warning text-canvas text-xs font-semibold px-2 py-0.5 rounded-full">
                      <Crown className="w-3 h-3" /> Premium
                    </div>
                    <p className="text-sm font-semibold text-primary mt-2">Premium</p>
                    <p className="text-2xl font-display font-bold text-primary my-1">₦1,500<span className="text-sm font-normal text-secondary">/mo</span></p>
                    <ul className="text-xs text-secondary space-y-1.5 mt-3">
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-accent" /> Unlimited accounts</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-accent" /> Full AI assistant</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-accent" /> Advanced analytics</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-accent" /> Priority support</li>
                    </ul>
                    <button className="w-full mt-4 py-2 gradient-bg text-white text-xs font-semibold rounded-md hover:opacity-90 transition">
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
                <div className="bg-surface2 rounded-md p-4">
                  <p className="text-xs text-secondary">
                    Billing is in Nigerian Naira (₦). Cancel anytime — no questions asked.
                    Premium unlocks the full AI assistant with personalised financial coaching.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Refer & Earn ── */}
          {active === 'refer' && (
            <Card>
              <CardHeader><CardTitle>Refer & Earn</CardTitle></CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-accent/20 rounded-lg p-5 mb-5 text-center">
                  <p className="text-3xl font-bold text-accent mb-1">₦500</p>
                  <p className="text-sm text-secondary">for every friend who signs up with your code</p>
                </div>

                <p className="text-sm text-secondary mb-4">Share your unique referral code. When a friend creates a Zinkro account and connects their first bank, you both get rewarded.</p>

                <div className="mb-5">
                  <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Your Referral Code</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-surface2 rounded-md px-4 py-3 font-mono text-sm text-accent font-semibold tracking-widest border border-border">
                      {referralCode}
                    </div>
                    <button
                      onClick={copyReferral}
                      className="px-4 py-3 gradient-bg text-white text-sm font-medium rounded-md hover:opacity-90 transition flex items-center gap-2 shrink-0"
                    >
                      {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Friends Referred', value: '0' },
                    { label: 'Pending Reward', value: '₦0' },
                    { label: 'Total Earned', value: '₦0' },
                  ].map(s => (
                    <div key={s.label} className="bg-surface2 rounded-md p-3 text-center">
                      <p className="text-lg font-bold text-primary">{s.value}</p>
                      <p className="text-xs text-secondary mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Security ── */}
          {active === 'security' && (
            <div className="space-y-5">
              {/* Change Password */}
              <Card>
                <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSave} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPw ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="w-full px-3 py-2.5 pr-10 rounded-md bg-surface2 border border-border text-primary text-sm focus:outline-none focus:border-accent/50 transition"
                        />
                        <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition">
                          {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          className="w-full px-3 py-2.5 pr-10 rounded-md bg-surface2 border border-border text-primary text-sm focus:outline-none focus:border-accent/50 transition"
                        />
                        <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition">
                          {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 rounded-md bg-surface2 border border-border text-primary text-sm focus:outline-none focus:border-accent/50 transition"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={pwLoading}
                        className="px-5 py-2.5 gradient-bg text-white text-sm font-medium rounded-md hover:opacity-90 transition flex items-center gap-2"
                      >
                        {pwLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...</> : 'Update Password'}
                      </button>
                      {pwSaved && (
                        <div className="flex items-center gap-1.5 text-success text-sm">
                          <Check className="w-4 h-4" /> Password updated!
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* 2FA */}
              <Card>
                <CardHeader><CardTitle>Two-Factor Authentication</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-primary">Authenticator App</p>
                        <p className="text-xs text-secondary">
                          {twoFA ? 'Active — your account is extra secure' : 'Add an extra layer of security to your account'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTwoFA(v => !v)}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors ${twoFA ? 'bg-success' : 'bg-border'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow mx-1 transition-transform ${twoFA ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card>
                <CardHeader><CardTitle>Active Sessions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'Lagos, Nigeria', time: 'Active now', current: true },
                    { device: 'Safari on iPhone', location: 'Lagos, Nigeria', time: '2 hours ago', current: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 bg-surface2 rounded-md p-3">
                      <LogOut className="w-4 h-4 text-secondary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-primary font-medium">{s.device}</p>
                        <p className="text-xs text-secondary">{s.location} · {s.time}</p>
                      </div>
                      {s.current
                        ? <Badge variant="success" className="shrink-0">This device</Badge>
                        : <button className="text-xs text-red-400 hover:text-red-300 transition shrink-0">Revoke</button>
                      }
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card>
                <CardHeader><CardTitle className="text-red-400">Danger Zone</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-secondary mb-4">
                    Deleting your account is permanent and cannot be undone. All your data — transactions, budgets, and goals — will be erased.
                  </p>
                  {!deleteConfirm ? (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-red-500/30 text-red-400 text-sm font-medium rounded-md hover:bg-red-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete my account
                    </button>
                  ) : (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 space-y-3">
                      <p className="text-sm text-red-400 font-medium">Are you absolutely sure?</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          className="px-4 py-2 bg-surface2 text-secondary text-sm rounded-md hover:text-primary transition"
                        >
                          Cancel
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition">
                          Yes, delete my account
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
