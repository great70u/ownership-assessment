'use client'
import { useState, useEffect } from 'react'
import { useAccounts, useUser } from '@/lib/demo-store'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  User, Link2, CreditCard, Share2, Moon, Shield,
  CheckCircle2, Crown, Check, Copy
} from 'lucide-react'

export default function SettingsPage() {
  const user = useUser()
  const accounts = useAccounts()
  const [darkMode, setDarkMode] = useState(true)
  const [faceId, setFaceId] = useState(true)
  const [copied, setCopied] = useState(false)

  const referralCode = user?.referralCode ?? ''

  useEffect(() => {
    const savedDark = localStorage.getItem('zinkro-dark-mode')
    if (savedDark !== null) setDarkMode(savedDark === 'true')
    const savedFaceId = localStorage.getItem('zinkro-face-id')
    if (savedFaceId !== null) setFaceId(savedFaceId === 'true')
  }, [])

  function toggleDarkMode() {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('zinkro-dark-mode', String(next))
  }

  function toggleFaceId() {
    const next = !faceId
    setFaceId(next)
    localStorage.setItem('zinkro-face-id', String(next))
  }

  async function copyReferralCode() {
    await navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <h1 className="text-2xl font-display font-bold text-primary mb-6">Settings</h1>

      <div className="grid grid-cols-[200px_1fr] gap-6">
        {/* Left nav */}
        <div className="space-y-1">
          {[
            { icon: User, label: 'Profile' },
            { icon: Link2, label: 'Connected Accounts' },
            { icon: CreditCard, label: 'Subscription' },
            { icon: Share2, label: 'Refer & Earn' },
            { icon: Shield, label: 'Security' },
          ].map(({ icon: Icon, label }, i) => (
            <button
              key={label}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors ${i === 0 ? 'bg-accent/15 text-accent' : 'text-secondary hover:text-primary hover:bg-surface2'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="space-y-5">
          {/* Profile card */}
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white text-xl font-bold">
                  AT
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary">{user?.name}</h3>
                  <p className="text-sm text-secondary">{user?.email}</p>
                  <Badge variant="success" className="mt-1">Health Score: 78</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name', value: user?.name ?? '' },
                  { label: 'Email', value: user?.email ?? '' },
                  { label: 'Member Since', value: 'January 2026' },
                  { label: 'Plan', value: 'Free' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-surface2 rounded-md p-3">
                    <p className="text-xs text-secondary mb-1">{label}</p>
                    <p className="text-sm text-primary font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader><CardTitle>Connected Accounts</CardTitle></CardHeader>
            <CardContent className="space-y-2.5">
              {accounts.map(acc => (
                <div key={acc.id} className="flex items-center gap-3 bg-surface2 rounded-md p-3">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: acc.color }}>
                    {acc.bankName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">{acc.bankName}</p>
                    <p className="text-xs text-secondary">••••{acc.accountNumber.slice(-4)} · {acc.accountType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{formatCurrency(acc.balance)}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <span className="text-xs text-success">Synced</span>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-border rounded-md text-sm text-secondary hover:text-accent hover:border-accent/50 transition-colors">
                + Add another bank
              </button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader><CardTitle>Subscription</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-accent rounded-lg p-4 relative">
                  <Badge variant="default" className="absolute -top-2.5 left-3">Current Plan</Badge>
                  <p className="text-sm font-semibold text-primary mt-1">Free</p>
                  <p className="text-2xl font-display font-bold text-primary my-1">₦0<span className="text-sm font-normal text-secondary">/mo</span></p>
                  <ul className="text-xs text-secondary space-y-1 mt-2">
                    <li>• 3 connected accounts</li>
                    <li>• Basic AI insights</li>
                    <li>• 6 budget categories</li>
                    <li>• 3 savings goals</li>
                  </ul>
                </div>
                <div className="bg-surface2 border border-border rounded-lg p-4 relative">
                  <div className="absolute -top-2.5 left-3 flex items-center gap-1 bg-warning text-canvas text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Crown className="w-3 h-3" /> Premium
                  </div>
                  <p className="text-sm font-semibold text-primary mt-1">Premium</p>
                  <p className="text-2xl font-display font-bold text-primary my-1">₦1,500<span className="text-sm font-normal text-secondary">/mo</span></p>
                  <ul className="text-xs text-secondary space-y-1 mt-2">
                    <li>• Unlimited accounts</li>
                    <li>• Full AI assistant</li>
                    <li>• Advanced analytics</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refer & Earn */}
          <Card>
            <CardHeader><CardTitle>Refer & Earn</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-secondary mb-3">Share Zinkro and earn ₦500 for every friend who signs up.</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-surface2 rounded-md px-4 py-2.5 font-mono text-sm text-accent font-semibold">
                  {referralCode}
                </div>
                <button
                  onClick={copyReferralCode}
                  className="flex items-center gap-1.5 px-4 py-2.5 gradient-bg text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-sm text-primary">Dark Mode</p>
                    <p className="text-xs text-secondary">Currently {darkMode ? 'on' : 'off'}</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-10 h-6 rounded-full flex items-center transition-colors ${darkMode ? 'bg-success' : 'bg-border'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow mx-1 transition-transform ${darkMode ? 'translate-x-4' : ''}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-sm text-primary">Face ID / Biometrics</p>
                    <p className="text-xs text-secondary">Require on every open</p>
                  </div>
                </div>
                <button
                  onClick={toggleFaceId}
                  className={`w-10 h-6 rounded-full flex items-center transition-colors ${faceId ? 'bg-success' : 'bg-border'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow mx-1 transition-transform ${faceId ? 'translate-x-4' : ''}`} />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
