import { useState } from 'react'

// Each question is a single behavioural statement rated by frequency.
// Never (0) through Always (4). Max score 40.
const QUESTIONS = [
  {
    id: 1,
    topic: 'Problem Flagging',
    statement: 'Team members proactively identify and flag problems before management notices them.',
    context: 'Rather than waiting for someone above them to spot the issue.',
  },
  {
    id: 2,
    topic: 'Escalation Quality',
    statement: 'When team members escalate an issue, they bring potential solutions with it.',
    context: 'Rather than handing over the problem alone.',
  },
  {
    id: 3,
    topic: 'Decision Making',
    statement: 'Team members make decisions within their scope without waiting for approval.',
    context: 'Rather than pausing work until someone signs off.',
  },
  {
    id: 4,
    topic: 'Project Ownership',
    statement: 'Team members take ownership of the outcome of a project, not just the tasks.',
    context: 'Rather than stopping once their assigned work is done.',
  },
  {
    id: 5,
    topic: 'Stakeholder Communication',
    statement: 'Team members keep stakeholders updated without being chased for information.',
    context: 'Rather than waiting until someone asks where things stand.',
  },
  {
    id: 6,
    topic: 'Reflection',
    statement: 'After completing a project, team members reflect on what worked and what did not.',
    context: 'Rather than moving straight on to the next thing.',
  },
  {
    id: 7,
    topic: 'Accountability',
    statement: 'When something goes wrong, team members take responsibility for it.',
    context: 'Rather than looking for someone else to blame.',
  },
  {
    id: 8,
    topic: 'Solving Posture',
    statement: 'When problems arise, team members ask how they can help solve them.',
    context: 'Rather than saying it falls outside their job.',
  },
  {
    id: 9,
    topic: 'Process Improvement',
    statement: 'Team members challenge processes and suggest improvements.',
    context: 'Rather than following instructions without question.',
  },
  {
    id: 10,
    topic: 'Work Context',
    statement: 'Team members communicate the why behind their work.',
    context: 'Rather than executing without explaining the reasoning.',
  },
]

const OPTIONS = [
  { label: 'Never', sub: '0 pts', value: 0 },
  { label: 'Rarely', sub: '1 pt', value: 1 },
  { label: 'Sometimes', sub: '2 pts', value: 2 },
  { label: 'Often', sub: '3 pts', value: 3 },
  { label: 'Always', sub: '4 pts', value: 4 },
]

const RESULTS = {
  active: {
    range: '28 to 40',
    label: 'Ownership-Active',
    tag: 'STRONG FOUNDATION',
    tagBg: '#FDBE0F',
    tagText: '#000000',
    headline: 'Your team demonstrates strong ownership behaviors.',
    summary: 'They proactively identify problems, make decisions within their scope, and take responsibility for outcomes, not just tasks. This is rare. Most organizations struggle to build this level of ownership consistency.',
    sectionLabel: 'To maintain this',
    points: [
      'Keep reinforcing the behaviors through feedback',
      'Make sure new hires are onboarded into this culture',
      'Watch for regression as the team grows',
    ],
    cta: 'If you want to scale this ownership culture or extend it to other teams, the Own It Program can help systematize what you are already doing well.',
  },
  partial: {
    range: '14 to 27',
    label: 'Ownership-Partial',
    tag: 'MOST COMMON PATTERN',
    tagBg: '#FFD243',
    tagText: '#000000',
    headline: 'Your team shows some ownership behaviors, but they are inconsistent.',
    summary: 'Some people take initiative, others wait. Some decisions get made quickly; others stall. This is the most common pattern we see. Your team has the capability, but the ownership behaviors are not embedded yet.',
    sectionLabel: 'What usually happens',
    points: [
      'Ownership shows up when there is pressure, disappears when there is not',
      'A few strong performers carry the load, others coast',
      'Managers still spend significant time supervising',
    ],
    cta: 'The fix: Install ownership as a behavioral standard, not a personality trait. The Own It Program is designed for exactly this, moving from partial to consistent ownership across your team.',
  },
  deficit: {
    range: '0 to 13',
    label: 'Ownership-Deficit',
    tag: 'NEEDS ATTENTION',
    tagBg: '#333333',
    tagText: '#FDBE0F',
    headline: 'Your team operates in waiting mode.',
    summary: 'They wait to be told what to do. They escalate decisions they should be making. They complete tasks but do not own outcomes. This is not a people problem; it is a system problem. Your team has learned to wait because that is what the environment rewards (or at least does not punish).',
    sectionLabel: 'The cost',
    points: [
      'Managers become bottlenecks',
      'Projects move slower than they should',
      'Talented people get frustrated and leave',
      'You are doing the thinking for everyone',
    ],
    cta: 'The good news: Ownership is trainable. It is a set of specific behaviors, and behaviors can be installed through the right structure. The Own It Program is built for teams in exactly this position. 6 weeks to shift from waiting to owning.',
  },
}

function getResult(score) {
  if (score >= 28) return { ...RESULTS.active, score }
  if (score >= 14) return { ...RESULTS.partial, score }
  return { ...RESULTS.deficit, score }
}

const f = {
  page: { minHeight: '100vh', background: '#000', color: '#fff', fontFamily: "'Montserrat',Arial,sans-serif" },

  // Header
  header: { borderBottom: '1px solid #262626', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#000', zIndex: 10 },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoImg: { height: '34px', width: '34px', objectFit: 'contain' },
  logoText: { fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em', color: '#fff' },
  progWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
  progBar: { width: '140px', height: '4px', background: '#2e2e2e', borderRadius: '2px', overflow: 'hidden' },
  progFill: (pct) => ({ height: '100%', width: `${pct}%`, background: '#FDBE0F', borderRadius: '2px', transition: 'width 0.4s ease' }),
  progLabel: { fontSize: '13px', color: '#fff', fontWeight: 600 },

  // Intro
  introWrap: { maxWidth: '760px', margin: '0 auto', padding: '80px 24px' },
  eyebrow: { display: 'inline-block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000', background: '#FDBE0F', padding: '7px 16px', marginBottom: '32px' },
  h1: { fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', marginBottom: '22px' },
  h1y: { color: '#FDBE0F' },
  sub: { fontSize: '17px', lineHeight: 1.7, color: '#e0e0e0', maxWidth: '540px', marginBottom: '48px', fontWeight: 400 },
  startBtn: (hov) => ({ display: 'inline-flex', alignItems: 'center', gap: '10px', background: hov ? '#fff' : '#FDBE0F', color: '#000', fontFamily: "'Montserrat',Arial,sans-serif", fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '19px 38px', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all .2s cubic-bezier(.22,1,.36,1)', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? '0 10px 26px rgba(253,190,15,0.32)' : 'none' }),
  metaRow: { display: 'flex', gap: '48px', marginTop: '64px', paddingTop: '40px', borderTop: '1px solid #262626' },
  metaNum: { fontWeight: 900, fontSize: '38px', color: '#FDBE0F', display: 'block', lineHeight: 1 },
  metaLbl: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', marginTop: '8px', display: 'block' },

  // Question
  qWrap: { maxWidth: '700px', margin: '0 auto', padding: '56px 24px 80px' },
  qMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  qNum: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' },
  qTopic: { fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000', background: '#FDBE0F', padding: '5px 13px' },
  qPrompt: { fontSize: 'clamp(20px, 2.9vw, 27px)', fontWeight: 700, lineHeight: 1.35, letterSpacing: '-0.02em', color: '#fff', marginBottom: '16px' },
  qContext: { fontSize: '15px', lineHeight: 1.6, color: '#fff', fontWeight: 400, paddingLeft: '16px', borderLeft: '3px solid #FDBE0F', marginBottom: '44px' },
  qInstruction: { fontSize: '12px', color: '#fff', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '18px' },

  // Options
  optGrid: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '48px' },
  optBtn: (sel, hov) => ({
    position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
    padding: '22px 8px 18px',
    background: sel ? '#FDBE0F' : (hov ? '#1f1f1f' : '#121212'),
    border: sel ? '2px solid #FDBE0F' : (hov ? '2px solid #FDBE0F' : '2px solid #333'),
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background .2s ease, border-color .2s ease, transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s ease',
    transform: sel ? 'translateY(-4px)' : (hov ? 'translateY(-4px)' : 'none'),
    boxShadow: sel ? '0 10px 26px rgba(253,190,15,0.30)' : (hov ? '0 8px 22px rgba(253,190,15,0.14)' : 'none'),
  }),
  // Signal-strength meter: n filled segments out of 4
  meterRow: { display: 'flex', alignItems: 'flex-end', gap: '3px', height: '26px' },
  meterSeg: (filled, sel, hov, i) => ({
    width: '5px',
    height: `${9 + i * 5}px`,
    borderRadius: '2px',
    background: filled
      ? (sel ? '#3d2d02' : '#FDBE0F')
      : (sel ? 'rgba(61,45,2,0.25)' : (hov ? '#3a3a3a' : '#2b2b2b')),
    transition: 'background .2s ease',
  }),
  optLbl: (sel) => ({ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: sel ? '#000' : '#fff', textAlign: 'center', lineHeight: 1.2 }),
  optSub: (sel) => ({ fontSize: '10px', fontWeight: 600, color: sel ? '#6b4f06' : '#8f8f8f', letterSpacing: '0.04em' }),

  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' },
  backBtn: (hov) => ({
    display: 'inline-flex', alignItems: 'center', gap: '9px',
    background: '#fff', color: '#000',
    fontWeight: 800, fontSize: '13px',
    letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '16px 30px',
    border: '2px solid #fff',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all .2s cubic-bezier(.22,1,.36,1)',
    transform: hov ? 'translateY(-2px)' : 'none',
    boxShadow: hov ? '0 8px 22px rgba(255,255,255,0.22)' : 'none',
  }),
  nextBtn: (dis, hov) => ({
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    background: '#FDBE0F',
    color: '#000',
    fontWeight: 800, fontSize: '13px',
    letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '16px 36px',
    border: '2px solid #FDBE0F',
    borderRadius: '8px',
    opacity: 1,
    cursor: dis ? 'not-allowed' : 'pointer',
    transition: 'all .2s cubic-bezier(.22,1,.36,1)',
    transform: (hov && !dis) ? 'translateY(-2px)' : 'none',
    boxShadow: (hov && !dis) ? '0 10px 26px rgba(253,190,15,0.32)' : 'none',
  }),
  navHint: { fontSize: '12px', color: '#FDBE0F', fontWeight: 700, letterSpacing: '0.05em', textAlign: 'center', marginTop: '20px' },

  // Result
  rWrap: { maxWidth: '720px', margin: '0 auto', padding: '60px 24px 100px' },
  scoreCenter: { textAlign: 'center', marginBottom: '56px' },
  scoreBox: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '156px', height: '156px', background: '#FDBE0F', marginBottom: '24px' },
  scoreNum: { fontWeight: 900, fontSize: '54px', color: '#000', lineHeight: 1, fontFamily: "'Montserrat',Arial,sans-serif" },
  scoreOf: { fontSize: '11px', fontWeight: 800, color: '#000', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' },
  rTag: (bg, tc) => ({ display: 'inline-block', background: bg, color: tc, fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '7px 16px', marginBottom: '14px' }),
  rLabel: { fontWeight: 900, fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '6px' },
  rRange: { fontSize: '13px', color: '#fff', fontWeight: 600 },
  card: { background: '#141414', border: '1px solid #333', padding: '30px', marginBottom: '12px' },
  cardEye: { fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FDBE0F', marginBottom: '14px' },
  cardHead: { fontWeight: 700, fontSize: 'clamp(17px, 2.5vw, 21px)', lineHeight: 1.35, color: '#fff', marginBottom: '12px', letterSpacing: '-0.01em' },
  cardBody: { fontSize: '15px', lineHeight: 1.8, color: '#e0e0e0' },
  bulletList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' },
  bulletItem: { display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '15px', lineHeight: 1.65, color: '#fff' },
  bulletMark: { width: '8px', height: '8px', background: '#FDBE0F', marginTop: '7px', flexShrink: 0 },
  ctaCard: { background: '#141414', border: '2px solid #FDBE0F', padding: '34px', marginTop: '12px' },
  ctaText: { fontSize: '15px', lineHeight: 1.8, color: '#fff', marginBottom: '26px' },
  ctaBtn: (hov) => ({ display: 'inline-flex', alignItems: 'center', gap: '10px', background: hov ? '#fff' : '#FDBE0F', color: '#000', fontFamily: "'Montserrat',Arial,sans-serif", fontWeight: 800, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '17px 34px', border: 'none', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', transition: 'all .2s cubic-bezier(.22,1,.36,1)', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? '0 10px 26px rgba(253,190,15,0.32)' : 'none' }),
  retake: (hov) => ({ display: 'block', width: '100%', textAlign: 'center', marginTop: '30px', background: 'transparent', color: hov ? '#FDBE0F' : '#fff', fontFamily: "'Montserrat',Arial,sans-serif", fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', textDecoration: 'underline', transition: 'color 0.15s ease' }),
}

export default function App() {
  const [phase, setPhase] = useState('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [hov, setHov] = useState(null)

  const totalQ = QUESTIONS.length
  const progress = phase === 'result' ? 100 : Math.round((current / totalQ) * 100)
  const q = QUESTIONS[current]
  const selected = answers[current]

  const handleSelect = (val) => setAnswers(prev => ({ ...prev, [current]: val }))
  const handleNext = () => { setHov(null); current < totalQ - 1 ? setCurrent(c => c + 1) : setPhase('result') }
  const handleBack = () => { setHov(null); current === 0 ? setPhase('intro') : setCurrent(c => c - 1) }
  const handleRetake = () => { setHov(null); setPhase('intro'); setCurrent(0); setAnswers({}) }

  const score = Object.values(answers).reduce((s, v) => s + v, 0)
  const result = getResult(score)

  return (
    <div style={f.page}>

      {/* HEADER */}
      <header style={f.header}>
        <div style={f.logoWrap}>
          <img src="/logo.png" alt="Beingsphere" style={f.logoImg} />
          <span style={f.logoText}>Beingsphere</span>
        </div>
        {phase !== 'intro' && (
          <div style={f.progWrap}>
            <div style={f.progBar}>
              <div style={f.progFill(progress)} />
            </div>
            <span style={f.progLabel}>
              {phase === 'result' ? 'Complete' : `${current + 1} / ${totalQ}`}
            </span>
          </div>
        )}
      </header>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={f.introWrap}>
          <span style={f.eyebrow}>Ownership Readiness Assessment</span>
          <h1 style={f.h1}>
            Does your team own outcomes<br />
            <span style={f.h1y}>or just complete tasks?</span>
          </h1>
          <p style={f.sub}>
            10 questions. 3 minutes. A clear picture of where ownership breaks down in your team and what to do about it.
          </p>
          <button
            style={f.startBtn(hov === 'start')}
            onMouseEnter={() => setHov('start')}
            onMouseLeave={() => setHov(null)}
            onClick={() => { setHov(null); setPhase('questions') }}
          >
            Start Assessment →
          </button>
          <div style={f.metaRow}>
            {[['10', 'Questions'], ['3', 'Minutes'], ['3', 'Outcome Levels']].map(([n, l]) => (
              <div key={l}>
                <span style={f.metaNum}>{n}</span>
                <span style={f.metaLbl}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUESTIONS */}
      {phase === 'questions' && (
        <div style={f.qWrap}>
          <div style={f.qMeta}>
            <span style={f.qNum}>Question {current + 1} of {totalQ}</span>
            <span style={f.qTopic}>{q.topic}</span>
          </div>

          <div style={f.qPrompt} className="fade-up" key={`s-${current}`}>{q.statement}</div>

          <div style={f.qContext} className="fade-up" key={`c-${current}`}>{q.context}</div>

          <div style={f.qInstruction}>
            How often is this true of your team?
          </div>

          {/* Options */}
          <div style={f.optGrid} className="stagger" key={`opts-${current}`}>
            {OPTIONS.map(opt => {
              const sel = selected === opt.value
              const isHov = hov === `opt${opt.value}`
              return (
                <button
                  key={opt.value}
                  style={f.optBtn(sel, isHov)}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setHov(`opt${opt.value}`)}
                  onMouseLeave={() => setHov(null)}
                >
                  <span style={f.meterRow}>
                    {[0, 1, 2, 3].map(i => (
                      <span key={i} style={f.meterSeg(i < opt.value, sel, isHov, i)} />
                    ))}
                  </span>
                  <span style={f.optLbl(sel)}>{opt.label}</span>
                  <span style={f.optSub(sel)}>{opt.sub}</span>
                </button>
              )
            })}
          </div>

          <div style={f.navRow}>
            <button
              style={f.backBtn(hov === 'back')}
              onMouseEnter={() => setHov('back')}
              onMouseLeave={() => setHov(null)}
              onClick={handleBack}
            >
              ← Back
            </button>
            <button
              style={f.nextBtn(selected === undefined, hov === 'next')}
              onMouseEnter={() => setHov('next')}
              onMouseLeave={() => setHov(null)}
              onClick={handleNext}
              disabled={selected === undefined}
            >
              {current === totalQ - 1 ? 'See My Results →' : 'Next →'}
            </button>
          </div>

          {selected === undefined && (
            <div style={f.navHint}>Choose an option above to continue</div>
          )}
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && (
        <div style={f.rWrap}>
          <div style={f.scoreCenter}>
            <div style={f.scoreBox} className="pop-in">
              <span style={f.scoreNum}>{score}</span>
              <span style={f.scoreOf}>out of 40</span>
            </div>
            <div><span style={f.rTag(result.tagBg, result.tagText)}>{result.tag}</span></div>
            <div style={f.rLabel}>{result.label}</div>
            <div style={f.rRange}>Score range: {result.range}</div>
          </div>

          <div style={f.card}>
            <div style={f.cardEye}>Diagnosis</div>
            <div style={f.cardHead}>{result.headline}</div>
            <p style={f.cardBody}>{result.summary}</p>
          </div>

          <div style={f.card}>
            <div style={f.cardEye}>{result.sectionLabel}</div>
            <ul style={f.bulletList}>
              {result.points.map((pt, i) => (
                <li key={i} style={f.bulletItem}>
                  <span style={f.bulletMark} />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div style={f.ctaCard}>
            <div style={f.cardEye}>Next Step</div>
            <p style={f.ctaText}>{result.cta}</p>
            <a
              href="https://www.beingsphereint.com/corporate/own-it"
              style={f.ctaBtn(hov === 'cta')}
              onMouseEnter={() => setHov('cta')}
              onMouseLeave={() => setHov(null)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn About the Own It Program →
            </a>
          </div>

          <button
            style={f.retake(hov === 'retake')}
            onMouseEnter={() => setHov('retake')}
            onMouseLeave={() => setHov(null)}
            onClick={handleRetake}
          >
            Retake assessment
          </button>
        </div>
      )}
    </div>
  )
}
