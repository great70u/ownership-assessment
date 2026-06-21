'use client'
import { useState } from 'react'
import { X, Loader2, Sparkles, PenLine, Check, AlertCircle } from 'lucide-react'
import { DEMO_ACCOUNTS } from '@/lib/demo-store'
import { useTransactionStore } from '@/store/transactionStore'
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/types'
import type { TransactionCategory, TransactionType } from '@/types'

const CATEGORIES: TransactionCategory[] = ['FEEDING', 'TRANSPORT', 'UTILITIES', 'GIFTS', 'RENT', 'INCOME', 'OTHER']

const EMPTY_FORM = {
  name: '',
  meta: '',
  amount: '',
  type: 'DEBIT' as TransactionType,
  category: 'OTHER' as TransactionCategory,
  accountId: '',
  date: new Date().toISOString().split('T')[0],
  note: '',
  rawSmsText: '',
}

export function AddTransactionModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'sms' | 'manual'>('sms')
  const [smsText, setSmsText] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [parsed, setParsed] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM, accountId: DEMO_ACCOUNTS[0]?.id || '' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const addTransaction = useTransactionStore(s => s.addTransaction)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function parseSms() {
    if (!smsText.trim()) return
    setParsing(true)
    setParseError('')
    setParsed(false)
    try {
      const res = await fetch('/api/ai/parse-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smsText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not parse SMS')
      const t = data.transaction
      setForm(prev => ({
        ...prev,
        name: t.name || '',
        meta: t.meta || '',
        amount: String(t.amount || ''),
        type: t.type || 'DEBIT',
        category: t.category || 'OTHER',
        date: t.date || prev.date,
        rawSmsText: smsText,
      }))
      setParsed(true)
    } catch (e: unknown) {
      setParseError(e instanceof Error ? e.message : 'Failed to parse SMS. Please enter details manually.')
    } finally {
      setParsing(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.amount || !form.accountId) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    addTransaction({
      accountId: form.accountId,
      name: form.name.trim(),
      meta: form.meta.trim() || 'Manual entry',
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      isRecurring: false,
      isAutoCategorized: parsed,
      rawSmsText: form.rawSmsText || undefined,
      note: form.note || undefined,
    })
    setSaving(false)
    setSuccess(true)
    setTimeout(() => { onClose() }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0d1625] border border-white/10 rounded-2xl w-full max-w-[520px] shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <h2 className="text-base font-semibold text-white">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 shrink-0">
          {(['sms', 'manual'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition ${
                tab === t ? 'bg-accent/15 text-accent' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === 'sms' ? <><Sparkles className="w-3.5 h-3.5" /> Paste SMS</> : <><PenLine className="w-3.5 h-3.5" /> Manual Entry</>}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-6 pb-6 pt-4">
          {/* SMS Tab */}
          {tab === 'sms' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400">Paste any Nigerian bank SMS alert. Zinkro AI will extract the transaction details automatically.</p>

              <div>
                <textarea
                  value={smsText}
                  onChange={e => { setSmsText(e.target.value); setParsed(false); setParseError('') }}
                  placeholder={`Example:\nAcct:2****90 Debited ₦5,000.00 on 20-Jun-2026 at POS/SHOPRITE IKEJA. Bal:₦307,800.00 - GTBank`}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 transition resize-none"
                />
              </div>

              {parseError && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {parseError}
                </div>
              )}

              {parsed && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  Parsed successfully! Review details below and click Add.
                </div>
              )}

              <button
                type="button"
                onClick={parseSms}
                disabled={parsing || !smsText.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {parsing ? <><Loader2 className="w-4 h-4 animate-spin" /> Parsing...</> : <><Sparkles className="w-4 h-4" /> Parse with AI</>}
              </button>

              {(parsed || parseError) && (
                <p className="text-xs text-gray-500 text-center">or switch to <button onClick={() => setTab('manual')} className="text-blue-400 hover:text-blue-300">Manual Entry</button></p>
              )}
            </div>
          )}

          {/* Form — shown in manual tab OR after SMS parse */}
          {(tab === 'manual' || parsed) && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {tab === 'sms' && parsed && <div className="border-t border-white/8 pt-4 mb-2"><p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">Parsed Details — Review & Edit</p></div>}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Transaction Name</label>
                  <input
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="e.g. Shoprite Ikeja"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Amount (₦)</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => update('amount', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Type</label>
                  <div className="flex rounded-xl overflow-hidden border border-white/10">
                    {(['DEBIT', 'CREDIT'] as TransactionType[]).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update('type', t)}
                        className={`flex-1 py-2.5 text-sm font-medium transition ${
                          form.type === t
                            ? t === 'CREDIT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            : 'bg-white/3 text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {t === 'DEBIT' ? 'Expense' : 'Income'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Category</label>
                  <select
                    value={form.category}
                    onChange={e => update('category', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition appearance-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} className="bg-[#0d1625]">
                        {CATEGORY_EMOJIS[c]} {CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Account</label>
                  <select
                    value={form.accountId}
                    onChange={e => update('accountId', e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition appearance-none"
                  >
                    {DEMO_ACCOUNTS.map(a => (
                      <option key={a.id} value={a.id} className="bg-[#0d1625]">{a.bankName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => update('date', e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Note (optional)</label>
                  <input
                    value={form.note}
                    onChange={e => update('note', e.target.value)}
                    placeholder="Add a note..."
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || success}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {success
                  ? <><Check className="w-4 h-4" /> Transaction Added!</>
                  : saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  : 'Add Transaction'
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
