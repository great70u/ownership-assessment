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
  header: { borderBottom: '1px solid #1a1a1a', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#000', zIndex: 10 },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoImg: { height: '34px', width: '34px', objectFit: 'contain' },
  logoText: { fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em', color: '#fff' },
  progWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
  progBar: { width: '140px', height: '2px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' },
  progFill: (pct) => ({ height: '100%', width: `${pct}%`, background: '#FDBE0F', borderRadius: '2px', transition: 'width 0.4s ease' }),
  progLabel: { fontSize: '12px', color: '#808080', fontWeight: 500 },

  // Intro
  introWrap: { maxWidth: '760px', margin: '0 auto', padding: '80px 24px' },
  eyebrow: { display: 'inline-block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000', background: '#FDBE0F', padding: '6px 16px', marginBottom: '32px' },
  h1: { fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', marginBottom: '22px' },
  h1y: { color: '#FDBE0F' },
  sub: { fontSize: '16px', lineHeight: 1.7, color: '#808080', maxWidth: '520px', marginBottom: '48px' },
  startBtn: { display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#FDBE0F', color: '#000', fontFamily: "'Montserrat',Arial,sans-serif", fontWeight: 800, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '18px 36px', border: 'none', cursor: 'pointer' },
  metaRow: { display: 'flex', gap: '48px', marginTop: '64px', paddingTop: '40px', borderTop: '1px solid #1a1a1a' },
  metaNum: { fontWeight: 900, fontSize: '38px', color: '#FDBE0F', display: 'block', lineHeight: 1 },
  metaLbl: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#808080', marginTop: '6px', display: 'block' },

  // Question
  qWrap: { maxWidth: '700px', margin: '0 auto', padding: '60px 24px 80px' },
  qMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  qNum: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#808080' },
  qTopic: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FDBE0F', background: 'rgba(253,190,15,0.08)', padding: '4px 12px' },
  qPrompt: { fontSize: 'clamp(19px, 2.9vw, 26px)', fontWeight: 700, lineHeight: 1.35, letterSpacing: '-0.02em', color: '#fff', marginBottom: '14px' },
  qContext: { fontSize: '14px', lineHeight: 1.6, color: '#666', fontWeight: 400, paddingLeft: '14px', borderLeft: '2px solid #FDBE0F', marginBottom: '40px' },
  qInstruction: { fontSize: '10px', color: '#555', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '14px' },

  // Two-pole display
  poleRow: { display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' },
  poleBox: (side) => ({
    flex: 1,
    padding: '16px',
    background: '#0d0d0d',
    border: '1px solid #1a1a1a',
    fontSize: '13px',
    lineHeight: 1.5,
    color: side === 'left' ? '#808080' : 'rgba(253,190,15,0.7)',
    fontWeight: 500,
    textAlign: side === 'left' ? 'left' : 'right',
  }),
  poleLabel: (side) => ({
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: side === 'left' ? '#333' : '#FDBE0F',
    marginBottom: '6px',
    display: 'block',
  }),

  // Options
  optGrid: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px', marginBottom: '48px' },
  optBtn: (sel) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    padding: '20px 6px 16px',
    background: sel ? '#FDBE0F' : '#0d0d0d',
    border: sel ? '2px solid #FDBE0F' : '1px solid #1a1a1a',
    cursor: 'pointer', transition: 'all 0.15s ease',
  }),
  optVal: (sel) => ({ fontWeight: 900, fontSize: '20px', color: sel ? '#000' : '#2a2a2a', fontFamily: "'Montserrat',Arial,sans-serif" }),
  optLbl: (sel) => ({ fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: sel ? '#000' : '#808080', textAlign: 'center' }),
  optSub: (sel) => ({ fontSize: '9px', fontWeight: 500, color: sel ? '#333' : '#444', letterSpacing: '0.02em' }),

  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { background: 'transparent', color: '#808080', fontFamily: "'Montserrat',Arial,sans-serif", fontWeight: 600, fontSize: '12px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' },
  nextBtn: (dis) => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: dis ? '#111' : '#FDBE0F',
    color: dis ? '#333' : '#000',
    fontFamily: "'Montserrat',Arial,sans-serif", fontWeight: 800, fontSize: '12px',
    letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '15px 30px', border: 'none',
    cursor: dis ? 'not-allowed' : 'pointer', transition: 'all 0.15s ease',
  }),

  // Result
  rWrap: { maxWidth: '720px', margin: '0 auto', padding: '60px 24px 100px' },
  scoreCenter: { textAlign: 'center', marginBottom: '56px' },
  scoreBox: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '150px', height: '150px', background: '#FDBE0F', marginBottom: '24px' },
  scoreNum: { fontWeight: 900, fontSize: '52px', color: '#000', lineHeight: 1, fontFamily: "'Montserrat',Arial,sans-serif" },
  scoreOf: { fontSize: '11px', fontWeight: 700, color: '#000', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' },
  rTag: (bg, tc) => ({ display: 'inline-block', background: bg, color: tc, fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 16px', marginBottom: '14px' }),
  rLabel: { fontWeight: 900, fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '-0.02em', color: '#fff', marginBottom: '4px' },
  rRange: { fontSize: '12px', color: '#808080', fontWeight: 500 },
  card: { background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '28px', marginBottom: '10px' },
  cardEye: { fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FDBE0F', marginBottom: '12px' },
  cardHead: { fontWeight: 700, fontSize: 'clamp(16px, 2.5vw, 20px)', lineHeight: 1.3, color: '#fff', marginBottom: '10px', letterSpacing: '-0.01em' },
  cardBody: { fontSize: '14px', lineHeight: 1.8, color: '#808080' },
  bulletList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' },
  bulletItem: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', lineHeight: 1.65, color: '#808080' },
  bulletMark: { width: '7px', height: '7px', background: '#FDBE0F', marginTop: '6px', flexShrink: 0 },
  ctaCard: { background: '#0d0d0d', border: '1px solid #FDBE0F', padding: '32px', marginTop: '10px' },
  ctaText: { fontSize: '14px', lineHeight: 1.8, color: '#808080', marginBottom: '24px' },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#FDBE0F', color: '#000', fontFamily: "'Montserrat',Arial,sans-serif", fontWeight: 800, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '15px 30px', border: 'none', cursor: 'pointer', textDecoration: 'none' },
  retake: { display: 'block', width: '100%', textAlign: 'center', marginTop: '28px', background: 'transparent', color: '#333', fontFamily: "'Montserrat',Arial,sans-serif", fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer' },
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
          <button style={f.startBtn} onClick={() => setPhase('questions')}>
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

          <div style={f.qPrompt}>{q.statement}</div>

          <div style={f.qContext}>{q.context}</div>

          <div style={f.qInstruction}>
            How often is this true of your team?
          </div>

          {/* Options */}
          <div style={f.optGrid}>
            {OPTIONS.map(opt => {
              const sel = selected === opt.value
              return (
                <button
                  key={opt.value}
                  style={f.optBtn(sel)}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = '#FDBE0F' }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = '#1a1a1a' }}
                >
                  <span style={f.optVal(sel)}>{opt.value}</span>
                  <span style={f.optLbl(sel)}>{opt.label}</span>
                  <span style={f.optSub(sel)}>{opt.sub}</span>
                </button>
              )
            })}
          </div>

          <div style={f.navRow}>
            <button style={f.backBtn} onClick={handleBack}>← Back</button>
            <button
              style={f.nextBtn(selected === undefined)}
              onClick={handleNext}
              disabled={selected === undefined}
            >
              {current === totalQ - 1 ? 'See My Results →' : 'Next →'}
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && (
        <div style={f.rWrap}>
          <div style={f.scoreCenter}>
            <div style={f.scoreBox}>
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
              style={f.ctaBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn About the Own It Program →
            </a>
          </div>

          <button style={f.retake} onClick={handleRetake}>Retake assessment</button>
        </div>
      )}
    </div>
  )
}
