import { useState } from 'react'

const QUESTIONS = [
  { id: 1, text: "When a problem arises, do your team members proactively identify it and flag it, or do they wait for management to notice?" },
  { id: 2, text: "When escalating issues, do your team members bring potential solutions or just problems?" },
  { id: 3, text: "Do your team members make decisions within their scope without waiting for approval?" },
  { id: 4, text: "When a project is assigned, do team members take ownership of the outcome, or just complete the tasks?" },
  { id: 5, text: "Do team members keep stakeholders updated proactively, or do people have to chase them for information?" },
  { id: 6, text: "After completing a project, do team members reflect on what worked and what didn't, or do they just move to the next thing?" },
  { id: 7, text: "When something goes wrong, do team members take responsibility, or look for someone else to blame?" },
  { id: 8, text: "Do team members ask 'how can I help solve this?' when problems arise, or say 'that's not my job'?" },
  { id: 9, text: "Do team members challenge processes or suggest improvements, or just follow instructions?" },
  { id: 10, text: "Do team members communicate the 'why' behind their work, or just execute without context?" },
]

const OPTIONS = [
  { label: 'Never', value: 0 },
  { label: 'Rarely', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Often', value: 3 },
  { label: 'Always', value: 4 },
]

const RESULTS = {
  active: {
    range: '28–40', label: 'Ownership-Active', tag: 'STRONG FOUNDATION',
    tagBg: '#FDBE0F', tagText: '#000000',
    headline: 'Your team demonstrates strong ownership behaviors.',
    summary: 'They proactively identify problems, make decisions within their scope, and take responsibility for outcomes, not just tasks. This is rare. Most organizations struggle to build this level of ownership consistency.',
    points: [
      'Keep reinforcing the behaviors through feedback',
      'Make sure new hires are onboarded into this culture',
      'Watch for regression as the team grows',
    ],
    cta: 'If you want to scale this ownership culture or extend it to other teams, the Own It Program can help systematize what you\'re already doing well.',
  },
  partial: {
    range: '14–27', label: 'Ownership-Partial', tag: 'MOST COMMON PATTERN',
    tagBg: '#FFD243', tagText: '#000000',
    headline: 'Your team shows some ownership behaviors, but they\'re inconsistent.',
    summary: 'Some people take initiative, others wait. Some decisions get made quickly; others stall. This is the most common pattern we see. Your team has the capability, but the ownership behaviors aren\'t embedded yet.',
    points: [
      'Ownership shows up when there\'s pressure, disappears when there isn\'t',
      'A few strong performers carry the load, others coast',
      'Managers still spend significant time supervising',
    ],
    cta: 'The fix: Install ownership as a behavioral standard, not a personality trait. The Own It Program is designed for exactly this, moving from partial to consistent ownership across your team.',
  },
  deficit: {
    range: '0–13', label: 'Ownership-Deficit', tag: 'NEEDS ATTENTION',
    tagBg: '#333333', tagText: '#FDBE0F',
    headline: 'Your team operates in waiting mode.',
    summary: 'They wait to be told what to do. They escalate decisions they should be making. They complete tasks but don\'t own outcomes. This isn\'t a people problem; it\'s a system problem. Your team has learned to wait because that\'s what the environment rewards (or at least doesn\'t punish).',
    points: [
      'Managers become bottlenecks',
      'Projects move slower than they should',
      'Talented people get frustrated and leave',
      'You\'re doing the thinking for everyone',
    ],
    cta: 'The good news: Ownership is trainable. It\'s a set of specific behaviors, and behaviors can be installed through the right structure. The Own It Program is built for teams in exactly this position. 6 weeks to shift from waiting to owning.',
  },
}

function getResult(score) {
  if (score >= 28) return { ...RESULTS.active, score }
  if (score >= 14) return { ...RESULTS.partial, score }
  return { ...RESULTS.deficit, score }
}

const S = {
  page: { minHeight: '100vh', background: '#000', color: '#fff', fontFamily: "'Montserrat', Arial, sans-serif" },
  header: { borderBottom: '1px solid #1a1a1a', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#000', zIndex: 10 },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoImg: { height: '36px', width: '36px', objectFit: 'contain' },
  logoText: { fontWeight: 800, fontSize: '17px', letterSpacing: '-0.01em', color: '#fff' },
  progressWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
  progressBar: { width: '140px', height: '2px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' },
  progressFill: (pct) => ({ height: '100%', width: `${pct}%`, background: '#FDBE0F', borderRadius: '2px', transition: 'width 0.4s ease' }),
  progressLabel: { fontSize: '12px', color: '#808080', fontWeight: 500 },
  introWrap: { maxWidth: '760px', margin: '0 auto', padding: '80px 24px 80px' },
  eyebrow: { display: 'inline-block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000', background: '#FDBE0F', padding: '6px 16px', marginBottom: '32px' },
  h1: { fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.03em', color: '#fff', marginBottom: '24px' },
  h1Yellow: { color: '#FDBE0F' },
  subText: { fontSize: '17px', lineHeight: 1.65, color: '#808080', maxWidth: '520px', marginBottom: '48px', fontWeight: 400 },
  startBtn: { display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#FDBE0F', color: '#000', fontFamily: "'Montserrat', Arial, sans-serif", fontWeight: 800, fontSize: '14px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '18px 36px', border: 'none', cursor: 'pointer' },
  metaRow: { display: 'flex', gap: '48px', marginTop: '72px', paddingTop: '48px', borderTop: '1px solid #1a1a1a' },
  metaNum: { fontWeight: 900, fontSize: '40px', color: '#FDBE0F', display: 'block', lineHeight: 1 },
  metaLabel: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#808080', marginTop: '6px', display: 'block' },
  qWrap: { maxWidth: '680px', margin: '0 auto', padding: '64px 24px 80px' },
  qNum: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#808080', marginBottom: '20px' },
  qText: { fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', color: '#fff', marginBottom: '48px' },
  optGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '56px' },
  optBtn: (sel) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
    padding: '24px 8px 20px',
    background: sel ? '#FDBE0F' : '#0d0d0d',
    border: sel ? '2px solid #FDBE0F' : '1px solid #1a1a1a',
    cursor: 'pointer', transition: 'all 0.15s ease',
  }),
  optVal: (sel) => ({ fontWeight: 900, fontSize: '22px', color: sel ? '#000' : '#333', fontFamily: "'Montserrat', Arial, sans-serif" }),
  optLabel: (sel) => ({ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: sel ? '#000' : '#808080', textAlign: 'center', lineHeight: 1.3 }),
  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { background: 'transparent', color: '#808080', fontFamily: "'Montserrat', Arial, sans-serif", fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' },
  nextBtn: (dis) => ({
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    background: dis ? '#1a1a1a' : '#FDBE0F',
    color: dis ? '#333' : '#000',
    fontFamily: "'Montserrat', Arial, sans-serif", fontWeight: 800, fontSize: '13px',
    letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '16px 32px', border: 'none',
    cursor: dis ? 'not-allowed' : 'pointer', transition: 'all 0.15s ease',
  }),
  rWrap: { maxWidth: '720px', margin: '0 auto', padding: '64px 24px 100px' },
  scoreCenter: { textAlign: 'center', marginBottom: '64px' },
  scoreBox: {
    display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    width: '160px', height: '160px', background: '#FDBE0F', marginBottom: '28px',
  },
  scoreNum: { fontWeight: 900, fontSize: '56px', color: '#000', lineHeight: 1, fontFamily: "'Montserrat', Arial, sans-serif" },
  scoreOf: { fontSize: '12px', fontWeight: 700, color: '#000', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' },
  rTag: (bg, text) => ({ display: 'inline-block', background: bg, color: text, fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 16px', marginBottom: '16px' }),
  rLabel: { fontWeight: 900, fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '6px' },
  rRange: { fontSize: '13px', color: '#808080', fontWeight: 500 },
  card: { background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '32px', marginBottom: '12px' },
  cardEyebrow: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FDBE0F', marginBottom: '14px' },
  cardHead: { fontWeight: 700, fontSize: 'clamp(17px, 2.5vw, 21px)', lineHeight: 1.3, color: '#fff', marginBottom: '12px', letterSpacing: '-0.01em' },
  cardBody: { fontSize: '15px', lineHeight: 1.75, color: '#808080', fontWeight: 400 },
  bulletList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' },
  bulletItem: { display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '15px', lineHeight: 1.65, color: '#808080' },
  bulletMark: { width: '8px', height: '8px', background: '#FDBE0F', marginTop: '7px', flexShrink: 0 },
  ctaCard: { background: '#0d0d0d', border: '1px solid #FDBE0F', padding: '36px', marginTop: '12px' },
  ctaText: { fontSize: '15px', lineHeight: 1.75, color: '#808080', marginBottom: '28px' },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#FDBE0F', color: '#000', fontFamily: "'Montserrat', Arial, sans-serif", fontWeight: 800, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '16px 32px', border: 'none', cursor: 'pointer', textDecoration: 'none' },
  retake: { display: 'block', width: '100%', textAlign: 'center', marginTop: '32px', background: 'transparent', color: '#333', fontFamily: "'Montserrat', Arial, sans-serif", fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer' },
}

export default function App() {
  const [phase, setPhase] = useState('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})

  const totalQ = QUESTIONS.length
  const progress = phase === 'result' ? 100 : Math.round((current / totalQ) * 100)
  const q = QUESTIONS[current]
  const selected = answers[current]

  const handleSelect = (val) => setAnswers(prev => ({ ...prev, [current]: val }))
  const handleNext = () => current < totalQ - 1 ? setCurrent(c => c + 1) : setPhase('result')
  const handleBack = () => current === 0 ? setPhase('intro') : setCurrent(c => c - 1)
  const handleRetake = () => { setPhase('intro'); setCurrent(0); setAnswers({}) }

  const score = Object.values(answers).reduce((s, v) => s + v, 0)
  const result = getResult(score)

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div style={S.logoWrap}>
          <img src="/logo.png" alt="Beingsphere" style={S.logoImg} />
          <span style={S.logoText}>Beingsphere</span>
        </div>
        {phase !== 'intro' && (
          <div style={S.progressWrap}>
            <div style={S.progressBar}>
              <div style={S.progressFill(progress)} />
            </div>
            <span style={S.progressLabel}>
              {phase === 'result' ? 'Complete' : `${current + 1} / ${totalQ}`}
            </span>
          </div>
        )}
      </header>

      {phase === 'intro' && (
        <div style={S.introWrap}>
          <span style={S.eyebrow}>Ownership Readiness Assessment</span>
          <h1 style={S.h1}>
            Does your team own outcomes<br />
            <span style={S.h1Yellow}>or just complete tasks?</span>
          </h1>
          <p style={S.subText}>
            10 questions. 3 minutes. A clear picture of where ownership breaks down in your team and what to do about it.
          </p>
          <button style={S.startBtn} onClick={() => setPhase('questions')}>
            Start Assessment →
          </button>
          <div style={S.metaRow}>
            {[['10', 'Questions'], ['3', 'Minutes'], ['3', 'Outcome Levels']].map(([n, l]) => (
              <div key={l}>
                <span style={S.metaNum}>{n}</span>
                <span style={S.metaLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'questions' && (
        <div style={S.qWrap}>
          <div style={S.qNum}>Question {current + 1} of {totalQ}</div>
          <div style={S.qText}>{q.text}</div>
          <div style={S.optGrid}>
            {OPTIONS.map(opt => {
              const sel = selected === opt.value
              return (
                <button
                  key={opt.value}
                  style={S.optBtn(sel)}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = '#FDBE0F' }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = '#1a1a1a' }}
                >
                  <span style={S.optVal(sel)}>{opt.value}</span>
                  <span style={S.optLabel(sel)}>{opt.label}</span>
                </button>
              )
            })}
          </div>
          <div style={S.navRow}>
            <button style={S.backBtn} onClick={handleBack}>← Back</button>
            <button style={S.nextBtn(selected === undefined)} onClick={handleNext} disabled={selected === undefined}>
              {current === totalQ - 1 ? 'See My Results →' : 'Next →'}
            </button>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div style={S.rWrap}>
          <div style={S.scoreCenter}>
            <div style={S.scoreBox}>
              <span style={S.scoreNum}>{score}</span>
              <span style={S.scoreOf}>out of 40</span>
            </div>
            <div><span style={S.rTag(result.tagBg, result.tagText)}>{result.tag}</span></div>
            <div style={S.rLabel}>{result.label}</div>
            <div style={S.rRange}>Score range: {result.range}</div>
          </div>

          <div style={S.card}>
            <div style={S.cardEyebrow}>Diagnosis</div>
            <div style={S.cardHead}>{result.headline}</div>
            <p style={S.cardBody}>{result.summary}</p>
          </div>

          <div style={S.card}>
            <div style={S.cardEyebrow}>What this means</div>
            <ul style={S.bulletList}>
              {result.points.map((pt, i) => (
                <li key={i} style={S.bulletItem}>
                  <span style={S.bulletMark} />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div style={S.ctaCard}>
            <div style={S.cardEyebrow}>Next Step</div>
            <p style={S.ctaText}>{result.cta}</p>
            <a
              href="https://www.beingsphereint.com/corporate/own-it"
              style={S.ctaBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn About the Own It Program →
            </a>
          </div>

          <button style={S.retake} onClick={handleRetake}>Retake assessment</button>
        </div>
      )}
    </div>
  )
}
