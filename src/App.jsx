import { useCallback, useEffect, useState } from 'react'
import { Laptop, Monitor, FlaskConical, Accessibility } from 'lucide-react'
import { useSimulation, useReducedMotion, SPEEDS } from './hooks/useSimulation'
import LaptopSvg from './components/devices/LaptopSvg'
import DesktopSvg from './components/devices/DesktopSvg'
import StageList from './components/StageList'
import InfoPanel from './components/InfoPanel'
import Controls from './components/Controls'

const STATUS_LABEL = {
  off: 'O‘chiq',
  running: 'Ishlamoqda',
  paused: 'Pauza',
  done: 'Tayyor',
}

export default function App() {
  const sim = useSimulation()
  const reduced = useReducedMotion()
  const [device, setDevice] = useState('laptop')
  const [selectedPart, setSelectedPart] = useState(null)

  // Qurilma almashtirilganda simulyatsiya qayta boshlanadi
  const changeDevice = useCallback(
    (d) => {
      if (d === device) return
      setDevice(d)
      setSelectedPart(null)
      sim.reset()
    },
    [device, sim],
  )

  // Klaviatura boshqaruvi
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      // Chizma qismlarida Enter/Space ularning o‘ziga tegishli
      if ((e.key === 'Enter' || e.key === ' ') && e.target?.getAttribute?.('role') === 'button') return
      if (e.key === ' ' && tag === 'BUTTON') return
      switch (e.key) {
        case 'p':
        case 'P':
          sim.power()
          break
        case ' ':
          e.preventDefault()
          sim.togglePause()
          break
        case 'ArrowRight':
        case 'n':
        case 'N':
          sim.nextStage()
          break
        case 'ArrowLeft':
          sim.prevStage()
          break
        case 'r':
        case 'R':
          sim.reset()
          break
        case '1':
        case '2':
        case '3':
          sim.setSpeed(SPEEDS[Number(e.key) - 1])
          break
        case 'l':
        case 'L':
          changeDevice('laptop')
          break
        case 'd':
        case 'D':
          changeDevice('desktop')
          break
        case 'Escape':
          setSelectedPart(null)
          break
        default:
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sim, changeDevice])

  const Device = device === 'laptop' ? LaptopSvg : DesktopSvg
  const screenMode = sim.status === 'done' ? 'desktop' : sim.stage.screen

  return (
    <div className="min-h-full lab-grid">
      <div className="mx-auto max-w-[1500px] px-4 py-4 sm:py-6 flex flex-col gap-4 min-h-full">
        {/* Sarlavha */}
        <header className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint-500/15 border border-mint-500/40 text-mint-300">
              <FlaskConical size={18} />
            </span>
            <div>
              <h1 className="text-lg font-semibold leading-tight">BootLab</h1>
              <p className="text-xs text-lab-300 leading-tight">Kompyuterning yoqilish jarayoni — interaktiv o‘quv simulyatori</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono
              ${sim.status === 'running' ? 'border-mint-500/50 text-mint-300 bg-mint-500/10' : sim.status === 'done' ? 'border-sky-500/50 text-sky-300 bg-sky-500/10' : 'border-lab-500 text-lab-300'}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${sim.status === 'running' ? 'bg-mint-400' : sim.status === 'done' ? 'bg-sky-400' : 'bg-lab-300'}`} />
              {STATUS_LABEL[sim.status]}
            </span>
            <div role="group" aria-label="Qurilma turi" className="flex rounded-xl border border-lab-600 bg-lab-800 p-1">
              <button
                type="button"
                onClick={() => changeDevice('laptop')}
                aria-pressed={device === 'laptop'}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${device === 'laptop' ? 'bg-mint-500 text-lab-950' : 'text-lab-300 hover:text-lab-100'}`}
              >
                <Laptop size={15} /> Noutbuk
              </button>
              <button
                type="button"
                onClick={() => changeDevice('desktop')}
                aria-pressed={device === 'desktop'}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${device === 'desktop' ? 'bg-mint-500 text-lab-950' : 'text-lab-300 hover:text-lab-100'}`}
              >
                <Monitor size={15} /> Stol kompyuteri
              </button>
            </div>
          </div>
        </header>

        {/* Asosiy maydon */}
        <main className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)_320px] xl:grid-cols-[260px_minmax(0,1fr)_360px] flex-1 *:min-w-0">
          <div className="glass rounded-2xl p-3 order-2 lg:order-1 min-w-0">
            <StageList stageIndex={sim.stageIndex} stageProgress={sim.stageProgress} isOn={sim.isOn} status={sim.status} onSelect={sim.goToStage} />
          </div>

          <section className="glass rounded-2xl p-2 sm:p-4 order-1 lg:order-2 flex flex-col min-w-0" aria-label="Qurilma chizmasi">
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-xs uppercase tracking-widest text-lab-300">{device === 'laptop' ? 'Noutbuk' : 'Stol kompyuteri'} · ichki ko‘rinish</span>
              {reduced && (
                <span className="inline-flex items-center gap-1 text-[11px] text-lab-300" title="Kamaytirilgan harakat rejimi yoqilgan">
                  <Accessibility size={13} /> kam harakat
                </span>
              )}
            </div>
            <div className="flex-1 min-h-[320px] sm:min-h-[420px] flex items-center justify-center">
              <div className="w-full max-w-[860px] aspect-[800/560]">
                <Device
                  key={device}
                  t={sim.t}
                  stage={sim.stage}
                  stageProgress={sim.stageProgress}
                  isOn={sim.isOn}
                  selected={selectedPart}
                  onSelect={(id) => setSelectedPart((p) => (p === id ? null : id))}
                  reduced={reduced}
                  screenMode={screenMode}
                />
              </div>
            </div>
          </section>

          <div className="order-3">
            <InfoPanel
              stage={sim.stage}
              stageIndex={sim.stageIndex}
              stageProgress={sim.stageProgress}
              isOn={sim.isOn}
              status={sim.status}
              selectedPart={selectedPart}
              onClearPart={() => setSelectedPart(null)}
              device={device}
            />
          </div>
        </main>

        {/* Boshqaruv */}
        <div className="sticky bottom-3 z-10">
          <Controls sim={sim} />
        </div>

        <footer className="text-[11px] text-lab-300 text-center pb-2">
          Diqqat: bu jarayon soddalashtirilgan o‘quv modeli. Haqiqiy kompyuterlarda bosqichlar bir-biriga qisman ustma-ust tushadi va ularning tartibi hamda davomiyligi uskuna va operatsion tizimga qarab farq qiladi.
        </footer>
      </div>
    </div>
  )
}
