import { useState, useEffect } from 'react'

// ─── Global CSS (injected once) ──────────────────────────────────────────────

const GLOBAL_CSS = `
  :root {
    --bg:           #ffffff;
    --bg-warm:      #f5f0eb;
    --bg-subtle:    #faf8f5;
    --text:         #1a1a1a;
    --text-2:       #5a5048;
    --text-3:       #8b7355;
    --border:       #e0d8ce;
    --border-strong:#b8ad9e;
    --accent:       #8b7355;
    --font-serif:   'Playfair Display', Georgia, serif;
    --font-sans:    'DM Sans', system-ui, sans-serif;
  }

  [data-theme="dark"] {
    --bg:           #0e0d0b;
    --bg-warm:      #151310;
    --bg-subtle:    #131110;
    --text:         #ede8e2;
    --text-2:       #9e9488;
    --text-3:       #7a6b55;
    --border:       #272420;
    --border-strong:#3a342c;
    --accent:       #c4a882;
  }

  body {
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.6;
    color: var(--text);
    background: var(--bg);
    transition: background 0.2s, color 0.2s;
  }

  button { cursor: pointer; background: none; border: none; font: inherit; color: inherit; }

  .nav-tab {
    font-family: var(--font-sans);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0 16px;
    height: 48px;
    display: inline-flex;
    align-items: center;
    color: var(--text-3);
    border-bottom: 1px solid transparent;
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .nav-tab:hover { color: var(--text); }
  .nav-tab.active { color: var(--text); border-bottom-color: var(--text); }

  .appt-card {
    border: 1px solid var(--border);
    padding: 24px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    margin-bottom: -1px;
  }
  .appt-card:hover { border-color: var(--border-strong); background: var(--bg-subtle); }
  .appt-card.flagged { border-left: 2px solid var(--accent); }

  .cb-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 11px 0;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
  }
  .cb-row:last-child { border-bottom: none; }

  .cb-box {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    margin-top: 2px;
    border: 1px solid var(--border-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, border-color 0.15s;
  }
  .cb-box.checked { background: var(--accent); border-color: var(--accent); }

  .accordion-btn {
    width: 100%;
    text-align: left;
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
    transition: opacity 0.15s;
  }
  .accordion-btn:hover .acc-label { color: var(--text); }

  .acc-label {
    font-family: var(--font-sans);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-2);
    transition: color 0.15s;
  }
  .acc-label.open { color: var(--text); }

  .presenter-panel {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 360px;
    background: var(--bg-warm);
    border: 1px solid var(--border-strong);
    z-index: 100;
  }

  .ghost-btn {
    font-family: var(--font-sans);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text);
    border: 1px solid var(--border-strong);
    padding: 11px 22px;
    background: transparent;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .ghost-btn:hover { border-color: var(--text); }

  .toggle-pill {
    width: 34px;
    height: 19px;
    border: 1px solid var(--border-strong);
    border-radius: 10px;
    position: relative;
    flex-shrink: 0;
    transition: background 0.2s, border-color 0.2s;
    cursor: pointer;
  }
  .toggle-pill.on { background: var(--accent); border-color: var(--accent); }
  .toggle-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: var(--bg);
    transition: transform 0.2s;
  }
  .toggle-pill.on .toggle-knob { transform: translateX(15px); }

  .draft-block {
    border: 1px solid var(--border);
    padding: 28px 32px;
    background: var(--bg-subtle);
    font-family: var(--font-sans);
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.9;
    white-space: pre-wrap;
  }

  @keyframes screenEnter {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .screen-enter {
    animation: screenEnter 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`

// ─── Mock Data ────────────────────────────────────────────────────────────────

const APPOINTMENTS = [
  {
    id: 1,
    time: '10:30',
    name: 'Amira K.',
    full: 'Amira Khalil',
    tier: 'Diamond VIP',
    note: 'Pre-event styling — Lake Como, late June',
    cities: 'Paris · Dubai',
    flagged: true,
  },
  {
    id: 2,
    time: '13:00',
    name: 'Charlotte M.',
    full: 'Charlotte Moreau',
    tier: 'VIP',
    note: 'Cruise collection preview',
    cities: 'Paris',
    flagged: false,
  },
  {
    id: 3,
    time: '15:30',
    name: 'Yuki T.',
    full: 'Yuki Tanaka',
    tier: 'VIP+',
    note: 'Anniversary gift selection',
    cities: 'Tokyo · Paris',
    flagged: false,
  },
]

const CLIENT = {
  name: 'Amira Khalil',
  short: 'Amira K.',
  tier: 'Diamond VIP',
  since: '2018',
  advisor: 'Sophie Laurent',
  cities: ['Paris (primary)', 'Dubai (seasonal)'],
  languages: ['English', 'French', 'Arabic'],
  event: 'Private lakeside gathering — Lake Como, late June',
  sizing: 'FR 38 (RTW) · Ring 54 · Bracelet S',
  prefs: {
    palette: 'Neutral — ivory, black, champagne, deep navy',
    silhouette: 'Structured, architectural. Clean tailoring. No drape.',
    categories: ['Ready-to-wear', 'Fine jewellery', 'Bags', 'Fragrance (selective)'],
    avoids: 'Trend-led pieces, logo-heavy styles, any bright colour',
  },
  history: [
    { year: '2024', item: 'Dior Toujours — black cannage', cat: 'Bag', tier: '●●' },
    { year: '2024', item: 'Rose des Vents — white gold & diamond', cat: 'Fine Jewellery', tier: '●●●' },
    { year: '2023', item: 'Bar jacket — ivory wool', cat: 'Ready-to-wear', tier: '●●' },
    { year: '2023', item: 'Lady Dior — black patent', cat: 'Bag', tier: '●●●' },
    { year: '2022', item: 'Victoire bracelet — yellow gold', cat: 'Fine Jewellery', tier: '●●' },
    { year: '2022', item: 'Tailored trousers — chalk (×2)', cat: 'Ready-to-wear', tier: '●' },
  ],
  privacy: 'Client prefers no written profile shared externally. All AI-assisted preparation is internal only and never surfaced to the client. The advisor retains full discretion over what is raised in-session.',
}

const BRIEF = [
  {
    id: 'relationship',
    title: 'Relationship Insight',
    defaultOpen: true,
    body: `Amira has been a client for six years. Her relationship with the house is personal, not transactional — she values your familiarity with her taste above broad product presentation. She has referenced the Bar jacket as a "perfect fit, first try" moment, suggesting she trusts curation over choice.

She visits twice yearly, typically aligned with Paris Fashion Week and pre-summer. The Lake Como event signals an appetite for something considered and occasion-specific this appointment.`,
  },
  {
    id: 'prepare',
    title: 'What to Prepare',
    body: `Pull three to five looks suitable for a lakeside evening setting — elevated but not formal. Think fluid ivory or midnight navy, refined metallics, no pattern. Have the Toujours in a second colourway ready as a natural companion to her existing black.

Reserve the new Rose des Vents extension for a quiet aside — she has shown sustained interest in the fine jewellery line and this continues naturally. Ensure fitting room availability from 10:15. Brief alterations on her Bar jacket measurements if she explores a second colourway.`,
  },
  {
    id: 'product',
    title: 'Product Directions',
    body: `— Cruise '25 ivory column dress: aligns with silhouette preference and occasion
— Dior Toujours in ecru or sand: conscious complement to her existing black
— Rose des Vents necklace (white gold pavé): within her stated aesthetic
— Bois de Rose fragrance (limited): she has worn Diorama; worth a quiet introduction
— Avoid: anything from the logo-prominent capsule this season; trend-editorial pieces`,
  },
  {
    id: 'cues',
    title: 'Conversation Cues',
    body: `Lake Como is a natural opening — enquire lightly about the gathering without probing. She has mentioned enjoying the quiet of the property.

If she references fashion press or current events, engage briefly then redirect to the personal. She dislikes when an appointment feels editorial.

Her daughter accompanied her last visit; a gentle reference is warm but do not over-rely on personal detail. A moment of silence is not discomfort — allow her to consider pieces without filling the space.`,
  },
  {
    id: 'discretion',
    title: 'Discretion Notes',
    body: `Do not reference specific spend figures or lifetime value in any form.
Do not mention waitlists or scarcity unless she enquires directly.
Do not suggest she might want to "move quickly" on any piece.
Do not photograph looks for internal sharing without explicit consent.

Governance note: this brief was generated with AI assistance and reflects purchase data and advisor notes only. It has not been validated against any external source. Advisor judgement supersedes all suggestions.`,
  },
]

const CHECKLIST = [
  { id: 1, cat: 'Fitting Room', text: 'Reserve room 2 from 10:15 — confirm with floor manager' },
  { id: 2, cat: 'Fitting Room', text: 'Still water (not sparkling) and Earl Grey tea' },
  { id: 3, cat: 'Selections',   text: 'Pull 3–5 Cruise looks: ivory, midnight navy, refined metallics' },
  { id: 4, cat: 'Selections',   text: 'Bring Dior Toujours in ecru and sand colourways' },
  { id: 5, cat: 'Selections',   text: 'Prepare Rose des Vents necklace (white gold pavé) for quiet aside' },
  { id: 6, cat: 'Selections',   text: 'Set aside Bois de Rose fragrance — optional introduction only' },
  { id: 7, cat: 'Alterations',  text: 'Pull Bar jacket measurements from previous visit (FR 38)' },
  { id: 8, cat: 'Alterations',  text: 'Confirm alterations team availability post 11:30' },
  { id: 9, cat: 'Logistics',    text: 'No photography of looks without explicit consent noted in file' },
  { id: 10, cat: 'Logistics',   text: 'Brief door team: escort directly to room 2, no boutique floor walk unless requested' },
]

const FOLLOWUP_DRAFT = `Dear Amira,

It was a genuine pleasure to receive you this morning.

I have arranged for the alterations on the ivory column dress to be completed by the 12th, ahead of your travel to Como. The jewellery selection will be held for you discreetly until you confirm — please take all the time you need.

Should anything else come to mind as you prepare for the gathering, I am always here.

With warmth,
Sophie`

const PRESENTER_SCRIPT = `PULSE · Client Advisor Briefing — 60-Second Demo Script

0 – 10s   OPEN
"This is an internal briefing tool for a luxury sales advisor preparing for a VIP client appointment. It is not a CRM, not a chatbot. It is a briefing system — designed to feel like reading a well-prepared dossier, not using software."

10 – 25s   APPOINTMENTS → PROFILE
"The advisor sees today's three appointments. She selects Amira K., a Diamond VIP client visiting from Paris. The profile shows preferences, purchase history, and a privacy note — everything visible to the advisor only. Nothing is surfaced to the client."

25 – 40s   AI BRIEF
"The AI Advisor Brief synthesises five lenses: relationship insight, what to prepare, product directions, conversation cues, and discretion notes. The AI advises. The advisor decides. That distinction is designed in — it is not a disclaimer."

40 – 52s   CHECKLIST + FOLLOW-UP
"The prep checklist is boutique-operational: rooms, selections, logistics. The follow-up draft is a starting point, not a finished message — the note says so explicitly."

52 – 60s   CLOSE
"The design principle is minimal: hairline borders, two typefaces, no colour noise. The product principle matches it. As the brief puts it: 'The goal is not more data. The goal is just enough insight to make the human interaction feel instinctive.'"`

// ─── Shared primitives ────────────────────────────────────────────────────────

function Label({ children, style }) {
  return (
    <span style={{
      fontFamily: 'var(--font-sans)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-3)',
      ...style,
    }}>
      {children}
    </span>
  )
}

function Serif({ as: Tag = 'h2', size = 28, weight = 400, italic = false, children, style }) {
  return (
    <Tag style={{
      fontFamily: 'var(--font-serif)',
      fontWeight: weight,
      fontSize: size,
      fontStyle: italic ? 'italic' : 'normal',
      letterSpacing: '-0.01em',
      color: 'var(--text)',
      lineHeight: 1.25,
      ...style,
    }}>
      {children}
    </Tag>
  )
}

function TierBadge({ tier }) {
  return (
    <span style={{
      fontFamily: 'var(--font-sans)',
      fontSize: '9px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      border: '1px solid var(--accent)',
      padding: '2px 7px',
      whiteSpace: 'nowrap',
    }}>
      {tier}
    </span>
  )
}

function Hr({ my = 32 }) {
  return <div style={{ borderTop: '1px solid var(--border)', margin: `${my}px 0` }} />
}

function GhostBtn({ children, onClick, style }) {
  return (
    <button className="ghost-btn" onClick={onClick} style={style}>
      {children}
    </button>
  )
}

// ─── Screen 1: Appointments ───────────────────────────────────────────────────

function AppointmentsScreen({ onSelect }) {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="">
      <Label style={{ display: 'block', marginBottom: '10px' }}>
        Paris Boutique · Avenue Montaigne
      </Label>
      <Serif as="h1" size={34} style={{ marginBottom: '6px' }}>Today's Appointments</Serif>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-3)', marginBottom: '40px' }}>
        {date}
      </p>

      <div>
        {APPOINTMENTS.map((a) => (
          <div
            key={a.id}
            className={`appt-card${a.flagged ? ' flagged' : ''}`}
            onClick={() => onSelect(a)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(a)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    color: 'var(--text-3)',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: '36px',
                  }}>
                    {a.time}
                  </span>
                  <Serif as="h3" size={18}>{a.name}</Serif>
                  <TierBadge tier={a.tier} />
                </div>
                <div style={{ paddingLeft: '48px' }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-2)', marginBottom: '5px' }}>
                    {a.note}
                  </p>
                  <Label>{a.cities}</Label>
                </div>
              </div>
              <span style={{ color: 'var(--border-strong)', fontSize: '16px' }}>→</span>
            </div>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        color: 'var(--text-3)',
        marginTop: '36px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border)',
      }}>
        Select a client to open their briefing. All material is for internal advisor use only.
      </p>
    </div>
  )
}

// ─── Screen 2: Client Profile ─────────────────────────────────────────────────

function ClientProfileScreen({ onNext }) {
  const c = CLIENT
  return (
    <div className="">
      <Label style={{ display: 'block', marginBottom: '10px' }}>Client Profile</Label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
        <Serif as="h1" size={34}>{c.name}</Serif>
        <TierBadge tier={c.tier} />
      </div>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-3)', marginBottom: '36px' }}>
        Client since {c.since} · Advisor: {c.advisor}
      </p>

      <Hr my={0} />

      {/* Meta grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 48px', padding: '28px 0' }}>
        {[
          { label: 'Cities', value: c.cities.join(' · ') },
          { label: 'Languages', value: c.languages.join(', ') },
          { label: 'Upcoming event', value: c.event },
          { label: 'Sizing reference', value: c.sizing },
        ].map(({ label, value }) => (
          <div key={label}>
            <Label style={{ display: 'block', marginBottom: '5px' }}>{label}</Label>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>{value}</p>
          </div>
        ))}
      </div>

      <Hr my={0} />

      {/* Preferences */}
      <div style={{ padding: '28px 0' }}>
        <Serif as="h2" size={20} style={{ marginBottom: '20px' }}>Preferences</Serif>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Colour palette', value: c.prefs.palette },
            { label: 'Silhouette', value: c.prefs.silhouette },
            { label: 'Categories', value: c.prefs.categories.join(' · ') },
            { label: 'Avoids', value: c.prefs.avoids },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', alignItems: 'baseline' }}>
              <Label>{label}</Label>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text)', lineHeight: 1.55 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <Hr my={0} />

      {/* Purchase history */}
      <div style={{ padding: '28px 0' }}>
        <Serif as="h2" size={20} style={{ marginBottom: '20px' }}>Purchase History</Serif>
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {c.history.map((p, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '52px 1fr 130px 32px',
              gap: '16px',
              padding: '11px 0',
              borderBottom: '1px solid var(--border)',
              alignItems: 'center',
            }}>
              <Label>{p.year}</Label>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text)' }}>{p.item}</p>
              <Label>{p.cat}</Label>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.05em' }}>{p.tier}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-3)', marginTop: '10px' }}>
          ● indicates relative tier; exact figures are not displayed
        </p>
      </div>

      <Hr my={0} />

      {/* Privacy note */}
      <div style={{ padding: '24px 28px', background: 'var(--bg-warm)', border: '1px solid var(--border)', margin: '28px 0' }}>
        <Label style={{ display: 'block', marginBottom: '10px' }}>Privacy Note</Label>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.75 }}>
          {c.privacy}
        </p>
      </div>

      <GhostBtn onClick={onNext}>View AI Brief →</GhostBtn>
    </div>
  )
}

// ─── Screen 3: AI Brief ───────────────────────────────────────────────────────

function Accordion({ title, body, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button className="accordion-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className={`acc-label${open ? ' open' : ''}`}>{title}</span>
        <span style={{ color: 'var(--text-3)', fontSize: '20px', lineHeight: 1, fontWeight: 300 }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div style={{
          padding: '20px 0 28px',
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          color: 'var(--text-2)',
          lineHeight: 1.85,
          whiteSpace: 'pre-wrap',
          borderBottom: '1px solid var(--border)',
        }}>
          {body}
        </div>
      )}
    </div>
  )
}

const GUARDRAILS = [
  {
    title: 'Privacy first',
    body: 'This brief is generated from internal purchase data and advisor notes only. No external data, social media, or third-party sources are used or inferred.',
  },
  {
    title: 'Advisor control',
    body: 'Every suggestion is a prompt, not an instruction. The advisor decides what is raised, when, and how. The AI has no visibility into the in-appointment conversation.',
  },
  {
    title: 'Assistive, not directive',
    body: 'The tool is designed to reduce preparation time, not to script the interaction. The relationship is human. The brief is a starting point.',
  },
  {
    title: 'Client transparency',
    body: 'Clients are informed at account creation that purchase data may be used to personalise service. No AI output is shared with or disclosed to the client.',
  },
]

function AIBriefScreen({ onNext }) {
  return (
    <div className="">
      <Label style={{ display: 'block', marginBottom: '10px' }}>AI Advisor Brief · Amira K.</Label>
      <Serif as="h1" size={34} style={{ marginBottom: '6px' }}>Pre-Appointment Brief</Serif>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-3)', marginBottom: '36px' }}>
        AI-assisted · Internal use only · Advisor discretion applies
      </p>

      <Hr my={0} />

      {BRIEF.map((s) => (
        <Accordion key={s.id} title={s.title} body={s.body} defaultOpen={s.defaultOpen} />
      ))}

      {/* Quote */}
      <div style={{
        margin: '52px 0',
        padding: '32px 36px',
        borderLeft: '1px solid var(--accent)',
        background: 'var(--bg-subtle)',
      }}>
        <Serif
          as="p"
          size={17}
          italic
          style={{ color: 'var(--text)', lineHeight: 1.75, letterSpacing: '0.005em' }}
        >
          "The goal is not more data. The goal is just enough insight to make the human interaction feel instinctive."
        </Serif>
      </div>

      {/* Governance Guardrails */}
      <div style={{ border: '1px solid var(--border)', padding: '28px 32px', background: 'var(--bg-warm)', marginBottom: '44px' }}>
        <Label style={{ display: 'block', marginBottom: '20px' }}>Governance Guardrails</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {GUARDRAILS.map(({ title, body }) => (
            <div key={title} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '16px' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--text)', paddingTop: '2px' }}>
                {title}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <GhostBtn onClick={onNext}>Open Prep Checklist →</GhostBtn>
    </div>
  )
}

// ─── Screen 4: Prep Checklist ─────────────────────────────────────────────────

function PrepChecklistScreen({ onNext }) {
  const [items, setItems] = useState(() => CHECKLIST.map(i => ({ ...i, done: false })))
  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  const done = items.filter(i => i.done).length
  const total = items.length
  const pct = Math.round((done / total) * 100)
  const cats = [...new Set(items.map(i => i.cat))]

  return (
    <div className="">
      <Label style={{ display: 'block', marginBottom: '10px' }}>Prep Checklist · Amira K. · 10:30</Label>
      <Serif as="h1" size={34} style={{ marginBottom: '16px' }}>Boutique Preparation</Serif>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '36px' }}>
        <div style={{ width: '140px', height: '1px', background: 'var(--border)', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${pct}%`,
            background: 'var(--accent)',
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          color: 'var(--text-3)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {done} / {total}
        </span>
      </div>

      <Hr my={0} />

      {cats.map(cat => (
        <div key={cat} style={{ padding: '24px 0' }}>
          <Label style={{ display: 'block', marginBottom: '12px' }}>{cat}</Label>
          <div>
            {items.filter(i => i.cat === cat).map(item => (
              <div
                key={item.id}
                className="cb-row"
                onClick={() => toggle(item.id)}
                role="checkbox"
                aria-checked={item.done}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggle(item.id)}
              >
                <div className={`cb-box${item.done ? ' checked' : ''}`}>
                  {item.done && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  color: item.done ? 'var(--text-3)' : 'var(--text)',
                  textDecoration: item.done ? 'line-through' : 'none',
                  transition: 'color 0.15s',
                  lineHeight: 1.5,
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Hr my={0} />

      <div style={{ paddingTop: '28px' }}>
        <GhostBtn onClick={onNext}>View Follow-Up Draft →</GhostBtn>
      </div>
    </div>
  )
}

// ─── Screen 5: Follow-Up ──────────────────────────────────────────────────────

function FollowUpScreen() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(FOLLOWUP_DRAFT).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="">
      <Label style={{ display: 'block', marginBottom: '10px' }}>Follow-Up · Post-Visit Draft</Label>
      <Serif as="h1" size={34} style={{ marginBottom: '6px' }}>Post-Visit Message</Serif>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-3)', marginBottom: '36px' }}>
        A starting point — your voice should shape the final message
      </p>

      <Hr my={0} />

      <div style={{ paddingTop: '24px', marginBottom: '16px' }}>
        <Label style={{ display: 'block', marginBottom: '7px' }}>Subject</Label>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text)' }}>
          A note after today — Dior Paris
        </p>
      </div>

      <Label style={{ display: 'block', marginBottom: '12px' }}>Message</Label>
      <div className="draft-block">{FOLLOWUP_DRAFT}</div>

      {/* Footnote row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px',
        padding: '16px 0',
        borderBottom: '1px solid var(--border)',
        marginBottom: '52px',
      }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          color: 'var(--text-3)',
          fontStyle: 'italic',
          lineHeight: 1.6,
        }}>
          Edit before sending. This draft is a starting point — the relationship is yours.
        </p>
        <button
          onClick={copy}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: copied ? 'var(--accent)' : 'var(--text)',
            border: `1px solid ${copied ? 'var(--accent)' : 'var(--border-strong)'}`,
            padding: '8px 16px',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
        >
          {copied ? 'Copied' : 'Copy draft'}
        </button>
      </div>

      {/* Closing quote */}
      <Serif
        as="p"
        size={15}
        italic
        style={{ color: 'var(--text-3)', lineHeight: 1.8, maxWidth: '480px' }}
      >
        "The goal is not more data. The goal is just enough insight to make the human interaction feel instinctive."
      </Serif>
    </div>
  )
}

// ─── Presenter Mode Panel ─────────────────────────────────────────────────────

function PresenterPanel({ onClose }) {
  return (
    <div className="presenter-panel">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 18px',
        borderBottom: '1px solid var(--border)',
      }}>
        <Label>Presenter Mode · 60s Script</Label>
        <button
          onClick={onClose}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '18px',
            color: 'var(--text-3)',
            lineHeight: 1,
            padding: '0 2px',
          }}
          aria-label="Close presenter panel"
        >
          ×
        </button>
      </div>
      <div style={{
        padding: '20px 18px',
        maxHeight: '420px',
        overflowY: 'auto',
        fontFamily: 'var(--font-sans)',
        fontSize: '12.5px',
        color: 'var(--text-2)',
        lineHeight: 1.85,
        whiteSpace: 'pre-wrap',
      }}>
        {PRESENTER_SCRIPT}
      </div>
    </div>
  )
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const NAV = [
  { id: 'appointments', label: 'Appointments' },
  { id: 'profile',      label: 'Client Profile' },
  { id: 'brief',        label: 'AI Brief' },
  { id: 'checklist',    label: 'Prep Checklist' },
  { id: 'followup',     label: 'Follow-Up' },
]

function TopNav({ screen, setScreen, dark, toggleDark, presenter, togglePresenter }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'stretch',
      padding: '0 40px',
      height: '48px',
    }}>
      {/* Wordmark */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        paddingRight: '32px',
        marginRight: '16px',
        borderRight: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 400,
          fontSize: '13px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--text)',
        }}>
          Dior
        </span>
      </div>

      {/* Tabs */}
      <nav style={{ display: 'flex', flex: 1, alignItems: 'stretch', overflowX: 'auto' }}>
        {NAV.map(({ id, label }) => (
          <button
            key={id}
            className={`nav-tab${screen === id ? ' active' : ''}`}
            onClick={() => setScreen(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', paddingLeft: '20px', borderLeft: '1px solid var(--border)' }}>
        <button
          onClick={togglePresenter}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: presenter ? 'var(--accent)' : 'var(--text-3)',
            padding: '2px 0',
            borderBottom: presenter ? '1px solid var(--accent)' : '1px solid transparent',
            transition: 'color 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          Presenter
        </button>

        <button
          className={`toggle-pill${dark ? ' on' : ''}`}
          onClick={toggleDark}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className="toggle-knob" />
        </button>
      </div>
    </header>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function StyleInjector() {
  useEffect(() => {
    const el = document.createElement('style')
    el.id = 'cab-global'
    el.textContent = GLOBAL_CSS
    document.head.appendChild(el)
    return () => document.getElementById('cab-global')?.remove()
  }, [])
  return null
}

export default function ClientAdvisorBriefing() {
  const [screen, setScreen] = useState('appointments')
  const [dark, setDark] = useState(false)
  const [presenter, setPresenter] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <>
      <StyleInjector />
      <TopNav
        screen={screen}
        setScreen={setScreen}
        dark={dark}
        toggleDark={() => setDark(d => !d)}
        presenter={presenter}
        togglePresenter={() => setPresenter(p => !p)}
      />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '56px 40px 100px' }}>
        <div key={screen} className="screen-enter">
          {screen === 'appointments' && (
            <AppointmentsScreen onSelect={() => setScreen('profile')} />
          )}
          {screen === 'profile' && (
            <ClientProfileScreen onNext={() => setScreen('brief')} />
          )}
          {screen === 'brief' && (
            <AIBriefScreen onNext={() => setScreen('checklist')} />
          )}
          {screen === 'checklist' && (
            <PrepChecklistScreen onNext={() => setScreen('followup')} />
          )}
          {screen === 'followup' && <FollowUpScreen />}
        </div>
      </main>
      {presenter && <PresenterPanel onClose={() => setPresenter(false)} />}
    </>
  )
}
