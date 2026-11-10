import { Info, Cpu, X, Terminal } from 'lucide-react'
import { PARTS } from '../data/parts'
import { STAGES } from '../data/stages'

export default function InfoPanel({ stage, stageIndex, stageProgress, isOn, status, selectedPart, onClearPart, device }) {
  const part = selectedPart ? PARTS[selectedPart] : null
  const partActive = part && isOn && stage.active.includes(part.id)

  return (
    <aside aria-live="polite" className="flex flex-col gap-4">
      {/* Bosqich izohi */}
      <section className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-lab-300">
          <Info size={14} /> Joriy bosqich
        </div>
        {isOn ? (
          <>
            <h2 className="mt-2 text-lg font-semibold text-mint-300">
              <span className="font-mono text-lab-300 mr-2">{stageIndex + 1}/{STAGES.length}</span>
              {stage.title}
            </h2>
            <p className="mt-2 text-sm text-lab-100/90 leading-relaxed">{stage.summary}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-lab-300">
              {stage.details.map((d, i) => {
                const reveal = stageProgress >= i / stage.details.length || status === 'done'
                return (
                  <li key={i} className={`flex gap-2 transition-opacity ${reveal ? 'opacity-100' : 'opacity-30'}`}>
                    <span className="text-mint-400 mt-[3px]">▸</span>
                    <span>{d}</span>
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <>
            <h2 className="mt-2 text-lg font-semibold">Kompyuter o‘chiq</h2>
            <p className="mt-2 text-sm text-lab-300 leading-relaxed">
              Simulyatsiyani boshlash uchun <b className="text-lab-100">Power</b> tugmasini bosing yoki klaviaturada <kbd className="px-1 rounded bg-lab-700 font-mono text-xs">P</kbd> ni bosing.
              Har qanday qismni bosib, uning vazifasi haqida o‘qishingiz mumkin.
            </p>
          </>
        )}
      </section>

      {/* Jurnal */}
      {isOn && (
        <section className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-lab-300">
            <Terminal size={14} /> Tizim jurnali
          </div>
          <pre className="mt-2 font-mono text-[11px] leading-5 text-mint-300/90 whitespace-pre-wrap">
            {stage.log
              .filter((_, i) => stageProgress >= i / stage.log.length || status === 'done')
              .map((l) => `[${stage.id.padEnd(10, ' ')}] ${l}`)
              .join('\n')}
            {status !== 'done' && <span className="animate-pulse">▌</span>}
          </pre>
        </section>
      )}

      {/* Qism izohi */}
      <section className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-lab-300">
            <Cpu size={14} /> Qism haqida
          </div>
          {part && (
            <button type="button" onClick={onClearPart} aria-label="Qism tanlovini bekor qilish" className="text-lab-300 hover:text-lab-100 rounded p-1">
              <X size={14} />
            </button>
          )}
        </div>
        {part ? (
          <>
            <h3 className="mt-2 font-semibold text-lab-100 flex items-center gap-2">
              {part.name}
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${partActive ? 'border-mint-500/50 text-mint-300 bg-mint-500/10' : 'border-lab-500 text-lab-300'}`}>
                {partActive ? 'faol' : 'kutmoqda'}
              </span>
            </h3>
            <p className="text-xs text-mint-300/80 mt-0.5">{part.role}</p>
            <p className="mt-2 text-sm text-lab-300 leading-relaxed">{part.detail}</p>
            <p className="mt-3 text-xs text-lab-300">
              Ishtirok etadi:{' '}
              {part.stages.map((i) => (
                <span key={i} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-lab-700 font-mono">
                  {i + 1}. {STAGES[i].short}
                </span>
              ))}
            </p>
            {device === 'laptop' && part.id === 'psu' && (
              <p className="mt-2 text-xs text-lab-300">Noutbukda PSU vazifasini batareya nazoratchisi va adapter bajaradi.</p>
            )}
          </>
        ) : (
          <p className="mt-2 text-sm text-lab-300">Chizmadagi istalgan qismni bosing (yoki Tab bilan tanlab Enter bosing) — uning vazifasi shu yerda ko‘rsatiladi.</p>
        )}
      </section>
    </aside>
  )
}
