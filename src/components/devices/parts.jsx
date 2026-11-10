// Qayta ishlatiladigan SVG qismlar. Hammasi `t` (vaqt) va `active` holatiga bog‘langan.
import { PARTS } from '../../data/parts'

const MINT = '#4ade80'
const AMBER = '#fbbf24'

/** Bosiladigan qism o‘rami: klaviatura va sichqoncha orqali tanlanadi */
export function Part({ id, active, selected, onSelect, children, className = '' }) {
  const info = PARTS[id]
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(id)
    }
  }
  return (
    <g
      className={`part-hit ${active ? 'glow-mint' : ''} ${className}`}
      role="button"
      tabIndex={0}
      aria-label={`${info.name}: ${info.role}`}
      aria-pressed={selected}
      data-active={active}
      onClick={() => onSelect(id)}
      onKeyDown={handleKey}
      style={{ opacity: active ? 1 : 0.55 }}
    >
      {children}
    </g>
  )
}

/** Qism ustidagi tanlov ramkasi */
export function Ring({ x, y, w, h, r = 6, visible }) {
  if (!visible) return null
  return (
    <rect
      x={x - 4}
      y={y - 4}
      width={w + 8}
      height={h + 8}
      rx={r + 2}
      fill="none"
      stroke="#fff"
      strokeWidth="1.5"
      strokeDasharray="4 3"
      pointerEvents="none"
    />
  )
}

/** Signal yo‘li: chiziq bo‘ylab harakatlanuvchi impulslar (dashoffset `t` ga bog‘liq) */
export function Trace({ d, t, active, reduced }) {
  const dash = 12
  const gap = 26
  const period = dash + gap
  const offset = reduced ? 0 : -((t * 70) % period)
  return (
    <g pointerEvents="none">
      <path d={d} fill="none" stroke="#2b3a52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {active && (
        <>
          <path d={d} fill="none" stroke={MINT} strokeOpacity="0.25" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d={d}
            fill="none"
            stroke={MINT}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={offset}
            className="glow-mint"
          />
        </>
      )}
    </g>
  )
}

export function Label({ x, y, children, anchor = 'middle', size = 10, dim }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontFamily="JetBrains Mono, ui-monospace, monospace"
      fill={dim ? '#94a3b8' : '#e2e8f0'}
      pointerEvents="none"
      style={{ userSelect: 'none' }}
    >
      {children}
    </text>
  )
}

/* ---------- Konkret qismlar ---------- */

export function Chip({ x, y, w, h, active, label, pins = 8, accent = MINT }) {
  const pinEls = []
  const step = w / (pins + 1)
  for (let i = 1; i <= pins; i++) {
    pinEls.push(<rect key={`t${i}`} x={x + i * step - 1.5} y={y - 5} width="3" height="5" fill="#64748b" />)
    pinEls.push(<rect key={`b${i}`} x={x + i * step - 1.5} y={y + h} width="3" height="5" fill="#64748b" />)
  }
  return (
    <g>
      {pinEls}
      <rect x={x} y={y} width={w} height={h} rx="4" fill={active ? '#0f3d2a' : '#1a2538'} stroke={active ? accent : '#3b4b66'} strokeWidth="1.5" />
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx="2" fill={active ? '#14532d' : '#111a2c'} stroke={active ? accent : '#263349'} strokeWidth="1" />
      <Label x={x + w / 2} y={y + h / 2 + 4} size={Math.max(9, Math.min(12, h / 4))}>{label}</Label>
    </g>
  )
}

export function Cpu({ x, y, w = 70, h = 70, active, t }) {
  const pulse = active ? 0.5 + 0.5 * Math.sin(t * 6) : 0
  return (
    <g>
      <Chip x={x} y={y} w={w} h={h} active={active} label="CPU" pins={10} />
      <rect x={x + 16} y={y + 16} width={w - 32} height={h - 32} rx="2" fill="none" stroke={MINT} strokeOpacity={pulse * 0.9} strokeWidth="2" />
    </g>
  )
}

export function RamStick({ x, y, w, h, active, vertical = false, label }) {
  const cells = []
  const n = vertical ? 6 : 8
  for (let i = 0; i < n; i++) {
    const cx = vertical ? x + 2 : x + 4 + i * ((w - 8) / n)
    const cy = vertical ? y + 4 + i * ((h - 8) / n) : y + 3
    cells.push(
      <rect
        key={i}
        x={cx}
        y={cy}
        width={vertical ? w - 4 : (w - 8) / n - 3}
        height={vertical ? (h - 8) / n - 3 : h - 6}
        rx="1.5"
        fill={active ? '#14532d' : '#1a2538'}
        stroke={active ? MINT : '#3b4b66'}
        strokeWidth="0.8"
      />,
    )
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={active ? '#0f3d2a' : '#111a2c'} stroke={active ? MINT : '#3b4b66'} strokeWidth="1.2" />
      {cells}
      {label && (
        <Label x={vertical ? x + w / 2 : x + w / 2} y={vertical ? y - 6 : y + h + 11} size={9} dim>
          {label}
        </Label>
      )}
    </g>
  )
}

export function Ssd({ x, y, w, h, active, t }) {
  const blink = active ? (Math.floor(t * 8) % 2 === 0 ? 1 : 0.3) : 0.2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={active ? '#0f3d2a' : '#111a2c'} stroke={active ? MINT : '#3b4b66'} strokeWidth="1.2" />
      <rect x={x + 8} y={y + 5} width={w * 0.3} height={h - 10} rx="2" fill={active ? '#14532d' : '#1a2538'} stroke={active ? MINT : '#263349'} strokeWidth="0.8" />
      <rect x={x + 8 + w * 0.34} y={y + 5} width={w * 0.3} height={h - 10} rx="2" fill={active ? '#14532d' : '#1a2538'} stroke={active ? MINT : '#263349'} strokeWidth="0.8" />
      <circle cx={x + w - 10} cy={y + h / 2} r="3" fill={AMBER} fillOpacity={blink} className={active ? 'glow-amber' : ''} />
      <Label x={x + w / 2} y={y + h + 12} size={9} dim>SSD (NVMe)</Label>
    </g>
  )
}

export function UefiChip({ x, y, w = 40, h = 28, active }) {
  return (
    <g>
      <Chip x={x} y={y} w={w} h={h} active={active} label="UEFI" pins={4} accent={AMBER} />
    </g>
  )
}

export function Gpu({ x, y, w, h, active, label = 'GPU' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={active ? '#0f3d2a' : '#111a2c'} stroke={active ? MINT : '#3b4b66'} strokeWidth="1.2" />
      <Chip x={x + 8} y={y + 8} w={Math.min(w - 16, h - 16)} h={h - 16} active={active} label={label} pins={4} />
      {w > h + 40 && (
        <>
          <RamStick x={x + h + 4} y={y + 10} w={w - h - 16} h={h - 20} active={active} />
        </>
      )}
    </g>
  )
}

/** Ventilyator: burchak `t` ga bog‘liq; reduced-motion bo‘lsa aylanmaydi */
export function Fan({ cx, cy, r = 32, active, t, reduced, rpm = 2 }) {
  const angle = active && !reduced ? (t * 360 * rpm) % 360 : 0
  const blades = []
  for (let i = 0; i < 7; i++) {
    blades.push(
      <path
        key={i}
        d={`M0,-4 C ${r * 0.35},-${r * 0.6} ${r * 0.85},-${r * 0.45} ${r * 0.9},-${r * 0.05} C ${r * 0.6},0 ${r * 0.3},${r * 0.1} 0,4 Z`}
        fill={active ? '#2d6a4f' : '#263349'}
        stroke={active ? MINT : '#3b4b66'}
        strokeWidth="0.8"
        transform={`rotate(${(360 / 7) * i})`}
      />,
    )
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 6} fill="#0b1220" stroke={active ? MINT : '#3b4b66'} strokeWidth="1.5" />
      <g transform={`translate(${cx} ${cy}) rotate(${angle})`} style={{ transition: 'none' }}>
        {blades}
        <circle r={r * 0.22} fill="#1a2538" stroke={active ? MINT : '#3b4b66'} strokeWidth="1" />
      </g>
      <Label x={cx} y={cy + r + 20} size={9} dim>Sovitish</Label>
    </g>
  )
}

export function Psu({ x, y, w, h, active, t }) {
  const bars = [0, 1, 2]
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill={active ? '#0f3d2a' : '#111a2c'} stroke={active ? MINT : '#3b4b66'} strokeWidth="1.2" />
      {bars.map((i) => (
        <rect key={i} x={x + 10 + i * 8} y={y + 10} width="4" height={h - 20} rx="1" fill={active ? MINT : '#3b4b66'} fillOpacity={active ? 0.5 + 0.5 * Math.abs(Math.sin(t * 3 + i)) : 1} />
      ))}
      <Label x={x + w / 2 + 10} y={y + h / 2 - 2} size={11}>PSU</Label>
      <Label x={x + w / 2 + 10} y={y + h / 2 + 12} size={8} dim>12V · 5V · 3.3V</Label>
    </g>
  )
}

export function Battery({ x, y, w, h, active, t }) {
  const cells = [0, 1, 2]
  const cellH = (h - 24) / 3
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={active ? '#0f3d2a' : '#111a2c'} stroke={active ? MINT : '#3b4b66'} strokeWidth="1.2" />
      {cells.map((i) => (
        <rect
          key={i}
          x={x + 8}
          y={y + 8 + i * (cellH + 4)}
          width={w - 16}
          height={cellH}
          rx="3"
          fill={active ? '#14532d' : '#1a2538'}
          stroke={active ? MINT : '#263349'}
          strokeWidth="0.8"
          fillOpacity={active ? 0.7 + 0.3 * Math.abs(Math.sin(t * 2 + i)) : 1}
        />
      ))}
      <Label x={x + w / 2} y={y + h + 12} size={9} dim>Batareya</Label>
    </g>
  )
}

export function PowerButton({ cx, cy, active, pressed }) {
  const col = active || pressed ? MINT : '#64748b'
  return (
    <g>
      <circle cx={cx} cy={cy} r="11" fill="#0b1220" stroke={col} strokeWidth="2" />
      <path d={`M${cx - 5},${cy - 4} a7,7 0 1,0 10,0`} fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={cy - 8} x2={cx} y2={cy - 1} stroke={col} strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

/** Ekran mazmuni: off | logo | spinner | login | desktop */
export function ScreenContent({ x, y, w, h, mode, t, reduced, progress }) {
  const cx = x + w / 2
  const cy = y + h / 2
  const on = mode !== 'off'
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={on ? '#0a1628' : '#05080f'} stroke={on ? '#1e3a5f' : '#111a2c'} strokeWidth="1" />
      {mode === 'logo' && (
        <g>
          <circle cx={cx} cy={cy - 8} r={Math.min(w, h) * 0.12} fill="none" stroke={MINT} strokeWidth="3" />
          <path d={`M${cx - 6},${cy - 14} l6,-8 l6,8 l-6,8z`} fill={MINT} />
          <Label x={cx} y={cy + h * 0.22} size={h * 0.07} dim>BootLab UEFI · POST</Label>
        </g>
      )}
      {mode === 'spinner' && (
        <g>
          <g transform={`translate(${cx} ${cy - 6}) rotate(${reduced ? 0 : (t * 240) % 360})`}>
            <circle r={Math.min(w, h) * 0.1} fill="none" stroke="#1e3a5f" strokeWidth="3" />
            <circle r={Math.min(w, h) * 0.1} fill="none" stroke={MINT} strokeWidth="3" strokeDasharray="30 60" strokeLinecap="round" />
          </g>
          <Label x={cx} y={cy + h * 0.22} size={h * 0.07} dim>Tizim yuklanmoqda…</Label>
          <rect x={x + w * 0.25} y={cy + h * 0.3} width={w * 0.5} height="4" rx="2" fill="#1e3a5f" />
          <rect x={x + w * 0.25} y={cy + h * 0.3} width={w * 0.5 * progress} height="4" rx="2" fill={MINT} />
        </g>
      )}
      {mode === 'login' && (
        <g>
          <circle cx={cx} cy={cy - h * 0.14} r={Math.min(w, h) * 0.1} fill="#1e3a5f" stroke={MINT} strokeWidth="1.5" />
          <circle cx={cx} cy={cy - h * 0.17} r={Math.min(w, h) * 0.035} fill={MINT} />
          <path d={`M${cx - Math.min(w, h) * 0.06},${cy - h * 0.08} a${Math.min(w, h) * 0.06},${Math.min(w, h) * 0.05} 0 0,1 ${Math.min(w, h) * 0.12},0`} fill={MINT} />
          <Label x={cx} y={cy + h * 0.06} size={h * 0.07}>Foydalanuvchi</Label>
          <rect x={cx - w * 0.18} y={cy + h * 0.12} width={w * 0.36} height={h * 0.1} rx="3" fill="#0f172a" stroke="#334155" />
          <Label x={cx} y={cy + h * 0.195} size={h * 0.07} dim>{'•'.repeat(Math.min(8, Math.floor(progress * 10)))}</Label>
        </g>
      )}
      {mode === 'desktop' && (
        <g>
          <defs>
            <linearGradient id="deskbg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0f2a3a" />
              <stop offset="1" stopColor="#123b2e" />
            </linearGradient>
          </defs>
          <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx="3" fill="url(#deskbg)" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={Math.min(1, Math.max(0, progress * 5 - i * 0.8))}>
              <rect x={x + w * 0.05} y={y + h * 0.08 + i * h * 0.17} width={h * 0.11} height={h * 0.11} rx="2" fill={['#4ade80', '#38bdf8', '#fbbf24', '#f472b6'][i]} fillOpacity="0.85" />
              <rect x={x + w * 0.05} y={y + h * 0.08 + i * h * 0.17 + h * 0.13} width={h * 0.11} height="2" fill="#94a3b8" />
            </g>
          ))}
          <rect x={cx - w * 0.15} y={cy - h * 0.2} width={w * 0.45} height={h * 0.45} rx="3" fill="#0b1220" stroke="#334155" opacity={Math.min(1, Math.max(0, progress * 2 - 0.5))} />
          <rect x={x + 1} y={y + h - h * 0.12} width={w - 2} height={h * 0.12} fill="#0b1220" fillOpacity="0.9" />
          <circle cx={x + w * 0.06} cy={y + h - h * 0.06} r={h * 0.035} fill={MINT} />
          <Label x={x + w - 6} y={y + h - h * 0.04} size={h * 0.055} anchor="end" dim>12:00</Label>
        </g>
      )}
    </g>
  )
}
