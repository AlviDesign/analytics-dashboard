import { TrendingUp, TrendingDown, Users, DollarSign, MousePointerClick, Activity } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const REVENUE_DATA = [
  { month: 'Jun', revenue: 41200, target: 40000 },
  { month: 'Jul', revenue: 47800, target: 45000 },
  { month: 'Aug', revenue: 44100, target: 46000 },
  { month: 'Sep', revenue: 53600, target: 50000 },
  { month: 'Oct', revenue: 61900, target: 55000 },
  { month: 'Nov', revenue: 58400, target: 58000 },
  { month: 'Dec', revenue: 72300, target: 62000 },
  { month: 'Jan', revenue: 68700, target: 65000 },
  { month: 'Feb', revenue: 75100, target: 68000 },
  { month: 'Mar', revenue: 79400, target: 72000 },
  { month: 'Apr', revenue: 77800, target: 75000 },
  { month: 'May', revenue: 84291, target: 78000 },
]

function fmt(v) {
  return v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
}

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
      }}
    >
      <p style={{ color: 'var(--color-muted)', marginBottom: '6px', letterSpacing: '0.06em' }}>
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.stroke, marginBottom: '2px' }}>
          {entry.dataKey === 'revenue' ? 'Revenue' : 'Target'}&nbsp;&nbsp;
          <span style={{ color: 'var(--color-text-bright)', fontWeight: 500 }}>
            {fmt(entry.value)}
          </span>
        </p>
      ))}
    </div>
  )
}

function RevenueChart() {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '16px',
      }}
    >
      {/* chart header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '6px' }}>
            Revenue
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '26px', letterSpacing: '-0.03em', color: 'var(--color-text-bright)', lineHeight: 1 }}>
            $84,291
          </p>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[{ color: 'var(--color-accent)', label: 'Revenue' }, { color: 'var(--color-muted)', label: 'Target' }].map(({ color, label }) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.04em' }}>
              <span style={{ width: '20px', height: '2px', background: color, display: 'inline-block', borderRadius: '2px' }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* recharts area chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8ff47" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#e8ff47" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#555555" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#555555" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#1e1e1e" strokeDasharray="0" />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: '#555' }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: '#555' }}
            axisLine={false}
            tickLine={false}
            width={42}
            dx={-4}
          />
          <Tooltip content={<RevenueTooltip />} cursor={{ stroke: '#2a2a2a', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#333"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            fill="url(#targetGrad)"
            dot={false}
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#e8ff47"
            strokeWidth={2}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#e8ff47', stroke: '#080808', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const KPI_CARDS = [
  {
    label: 'Total Revenue',
    value: '$84,291',
    change: +12.4,
    sub: 'vs last 30 days',
    Icon: DollarSign,
    accent: 'var(--color-accent)',
  },
  {
    label: 'Active Users',
    value: '24,508',
    change: +8.1,
    sub: 'vs last 30 days',
    Icon: Users,
    accent: 'var(--color-green)',
  },
  {
    label: 'Conversion Rate',
    value: '3.62%',
    change: -1.8,
    sub: 'vs last 30 days',
    Icon: MousePointerClick,
    accent: 'var(--color-red)',
  },
  {
    label: 'Avg. Session',
    value: '4m 17s',
    change: +5.3,
    sub: 'vs last 30 days',
    Icon: Activity,
    accent: '#a78bfa',
  },
]

function StatCard({ label, value, change, sub, Icon, accent }) {
  const positive = change >= 0
  const trendColor = positive ? 'var(--color-green)' : 'var(--color-red)'
  const TrendIcon = positive ? TrendingUp : TrendingDown

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `color-mix(in srgb, ${accent} 12%, transparent)`,
            color: accent,
            flexShrink: 0,
          }}
        >
          <Icon size={16} />
        </span>
      </div>

      {/* value */}
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '32px',
          letterSpacing: '-0.03em',
          color: 'var(--color-text-bright)',
          lineHeight: 1,
        }}
      >
        {value}
      </span>

      {/* trend row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 500,
            color: trendColor,
          }}
        >
          <TrendIcon size={12} />
          {positive ? '+' : ''}{change}%
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-muted)',
          }}
        >
          {sub}
        </span>
      </div>

      {/* decorative corner glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `color-mix(in srgb, ${accent} 8%, transparent)`,
          pointerEvents: 'none',
          filter: 'blur(20px)',
        }}
      />
    </div>
  )
}

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'var(--color-base)',
    overflow: 'auto',
  },
  header: {
    padding: '32px 40px 28px',
    borderBottom: '1px solid var(--color-border)',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '28px',
    letterSpacing: '-0.02em',
    color: 'var(--color-text-bright)',
    lineHeight: 1.1,
    marginBottom: '6px',
  },
  subtitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: 400,
    color: 'var(--color-muted)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  body: {
    flex: 1,
    padding: '40px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
}

export default function Main() {
  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Overview</h1>
        <p style={styles.subtitle}>{today}</p>
      </header>
      <div style={styles.body}>
        <div style={styles.kpiGrid}>
          {KPI_CARDS.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
        <RevenueChart />
      </div>
    </main>
  )
}
