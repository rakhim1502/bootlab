import { useEffect, useRef } from 'react'
import { Check, CircleDot, Circle } from 'lucide-react'
import { STAGES } from '../data/stages'

export default function StageList({ stageIndex, stageProgress, isOn, status, onSelect }) {
  const listRef = useRef(null)

  // Mobil (gorizontal) ro‘yxatda joriy bosqichni ko‘rinadigan joyga suradi
  useEffect(() => {
    const el = listRef.current?.querySelector('[aria-current="step"]')
    if (el && listRef.current && listRef.current.scrollWidth > listRef.current.clientWidth) {
      el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    }
  }, [stageIndex, isOn])

  return (
    <nav aria-label="Yoqilish bosqichlari" className="flex flex-col gap-1">
      <h2 className="text-xs uppercase tracking-widest text-lab-300 mb-2 px-1">Bosqichlar</h2>
      <ol ref={listRef} className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible scrollbar-thin pb-1 lg:pb-0 min-w-0 max-w-full">
        {STAGES.map((st, i) => {
          const done = isOn && (i < stageIndex || (status === 'done' && i === stageIndex))
          const current = isOn && i === stageIndex && status !== 'done'
          const Icon = done ? Check : current ? CircleDot : Circle
          return (
            <li key={st.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={current ? 'step' : undefined}
                className={`group w-full text-left flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors
                  ${current ? 'bg-mint-500/10 border-mint-500/40 text-mint-300' : done ? 'border-transparent text-lab-100 hover:bg-lab-700/60' : 'border-transparent text-lab-300 hover:bg-lab-700/60 hover:text-lab-100'}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-mono border
                  ${current ? 'border-mint-400 bg-mint-500/20 text-mint-300' : done ? 'border-mint-600/60 bg-mint-600/20 text-mint-300' : 'border-lab-500 text-lab-300'}`}
                >
                  {done ? <Icon size={14} /> : i + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium truncate">{st.title}</span>
                  {current && (
                    <span className="mt-1 block h-1 w-full rounded-full bg-lab-600 overflow-hidden">
                      <span className="block h-full bg-mint-400" style={{ width: `${Math.round(stageProgress * 100)}%` }} />
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
