import { useState } from 'react'
import {
  LayoutDashboard,
  BarChart2,
  Users,
  CalendarDays,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',   Icon: LayoutDashboard },
  { id: 'analytics',  label: 'Analytics',  Icon: BarChart2 },
  { id: 'audience',   label: 'Audience',   Icon: Users },
  { id: 'events',     label: 'Events',     Icon: CalendarDays },
  { id: 'settings',   label: 'Settings',   Icon: Settings },
]

const styles = {
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100vh',
    background: 'var(--color-surface)',
    borderRight: '1px solid var(--color-border)',
    padding: '0',
    overflow: 'hidden',
  },
  wordmark: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '22px',
    letterSpacing: '0.12em',
    color: 'var(--color-accent)',
    padding: '28px 24px 24px',
    borderBottom: '1px solid var(--color-border)',
    userSelect: 'none',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '16px 12px',
    flex: 1,
  },
  navItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: active ? 600 : 400,
    fontSize: '13.5px',
    letterSpacing: '0.02em',
    color: active ? 'var(--color-accent)' : 'var(--color-muted)',
    background: active ? 'rgba(232, 255, 71, 0.07)' : 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'color 0.15s, background 0.15s',
  }),
  navIcon: (active) => ({
    flexShrink: 0,
    color: active ? 'var(--color-accent)' : 'var(--color-muted)',
    transition: 'color 0.15s',
  }),
}

export default function Sidebar() {
  const [active, setActive] = useState('overview')

  return (
    <aside style={styles.sidebar}>
      <div style={styles.wordmark}>PULSE</div>
      <nav style={styles.nav}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              style={styles.navItem(isActive)}
              onClick={() => setActive(id)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--color-text)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--color-muted)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <Icon size={16} style={styles.navIcon(isActive)} />
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
