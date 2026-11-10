import { Power, Pause, Play, SkipForward, SkipBack, RotateCcw, Gauge } from 'lucide-react'
import { SPEEDS } from '../hooks/useSimulation'
import { TOTAL_DURATION } from '../data/stages'

function Btn({ onClick, label, title, children, primary, disabled, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title || label}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed
        ${primary
          ? 'bg-mint-500 text-lab-950 border-mint-400 hover:bg-mint-400'
          : active
            ? 'bg-mint-500/15 border-mint-500/50 text-mint-300'
            : 'bg-lab-800 border-lab-600 text-lab-100 hover:bg-lab-700'}`}
    >
      {children}
    </button>
  )
}

export default function Controls({ sim }) {
  const { status, isOn, speed, setSpeed, power, togglePause, nextStage, prevStage, reset, t, progress } = sim
  const running = status === 'running'

  return (
    <div className="glass rounded-2xl p-3 sm:p-4 flex flex-col gap-3">
      {/* Umumiy progress */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-lab-300 w-14">{t.toFixed(1)}s</span>
        <div className="relative flex-1 h-2 rounded-full bg-lab-700 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Umumiy jarayon">
          <div className="absolute inset-y-0 left-0 bg-mint-400 rounded-full" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="font-mono text-xs text-lab-300 w-14 text-right">{TOTAL_DURATION}s</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Btn onClick={power} label={isOn ? 'O‘chirish' : 'Yoqish'} title="Power (P)" primary={!isOn} active={isOn}>
          <Power size={16} /> <span className="hidden sm:inline">{isOn ? 'O‘chirish' : 'Yoqish'}</span>
        </Btn>
        <Btn onClick={togglePause} label={running ? 'Pauza' : 'Davom ettirish'} title="Pauza / davom (Bo‘sh joy)" disabled={status === 'done'}>
          {running ? <Pause size={16} /> : <Play size={16} />}
          <span className="hidden sm:inline">{running ? 'Pauza' : 'Davom'}</span>
        </Btn>
        <Btn onClick={prevStage} label="Oldingi bosqich" title="Oldingi (←)" disabled={!isOn}>
          <SkipBack size={16} />
        </Btn>
        <Btn onClick={nextStage} label="Keyingi bosqich" title="Keyingi (→ yoki N)" disabled={status === 'done'}>
          <SkipForward size={16} /> <span className="hidden sm:inline">Keyingi</span>
        </Btn>
        <Btn onClick={reset} label="Qayta boshlash" title="Reset (R)">
          <RotateCcw size={16} /> <span className="hidden sm:inline">Reset</span>
        </Btn>

        <div className="ml-auto flex items-center gap-1 rounded-xl border border-lab-600 bg-lab-800 p-1" role="group" aria-label="Tezlik">
          <Gauge size={14} className="text-lab-300 ml-1" />
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              aria-pressed={speed === s}
              title={`Tezlik ${s}× (${SPEEDS.indexOf(s) + 1})`}
              className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${speed === s ? 'bg-mint-500 text-lab-950' : 'text-lab-300 hover:text-lab-100'}`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-lab-300 font-mono hidden md:block">
        Klaviatura: <kbd>P</kbd> power · <kbd>Bo‘sh joy</kbd> pauza · <kbd>←</kbd>/<kbd>→</kbd> bosqich · <kbd>R</kbd> reset · <kbd>1</kbd>/<kbd>2</kbd>/<kbd>3</kbd> tezlik · <kbd>L</kbd>/<kbd>D</kbd> qurilma · <kbd>Esc</kbd> tanlovni bekor qilish
      </p>
    </div>
  )
}
