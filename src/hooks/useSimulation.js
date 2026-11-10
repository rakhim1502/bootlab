import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { STAGES, STAGE_STARTS, TOTAL_DURATION, stageIndexAt, stageProgressAt } from '../data/stages'

export const SPEEDS = [0.5, 1, 2]

/**
 * Simulyatsiyaning yagona vaqt holati.
 * Barcha animatsiya va progress `t` (soniya, 1× tezlikda) qiymatiga bog‘lanadi.
 * status: 'off' | 'running' | 'paused' | 'done'
 */
export function useSimulation() {
  const [t, setT] = useState(0)
  const [status, setStatus] = useState('off')
  const [speed, setSpeed] = useState(1)
  const speedRef = useRef(speed)
  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  // rAF sikli — faqat 'running' holatida ishlaydi; pauza barchasini to‘xtatadi.
  useEffect(() => {
    if (status !== 'running') return undefined
    let raf = 0
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000) // sakrashlardan himoya
      last = now
      setT((prev) => {
        const next = prev + dt * speedRef.current
        if (next >= TOTAL_DURATION) {
          setStatus('done')
          return TOTAL_DURATION
        }
        return next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [status])

  const stageIndex = stageIndexAt(t)
  const stageProgress = stageProgressAt(t)
  const progress = Math.min(1, t / TOTAL_DURATION)

  const power = useCallback(() => {
    setStatus((s) => {
      if (s === 'off') {
        setT(0)
        return 'running'
      }
      setT(0)
      return 'off'
    })
  }, [])

  const togglePause = useCallback(() => {
    setStatus((s) => {
      if (s === 'running') return 'paused'
      if (s === 'paused') return 'running'
      if (s === 'off') {
        setT(0)
        return 'running'
      }
      return s
    })
  }, [])

  const goToStage = useCallback((i) => {
    const idx = Math.max(0, Math.min(STAGES.length - 1, i))
    setT(STAGE_STARTS[idx])
    setStatus((s) => (s === 'paused' ? 'paused' : 'running'))
  }, [])

  const nextStage = useCallback(() => {
    if (status === 'off') {
      goToStage(0)
      return
    }
    const i = stageIndexAt(t)
    if (i >= STAGES.length - 1) {
      setT(TOTAL_DURATION)
      setStatus('done')
      return
    }
    goToStage(i + 1)
  }, [status, t, goToStage])

  const prevStage = useCallback(() => {
    if (status === 'off') return
    const i = stageIndexAt(t)
    const local = t - STAGE_STARTS[i]
    // Bosqich boshida bo‘lsak — oldingisiga, aks holda shu bosqich boshiga
    goToStage(local > 0.4 || i === 0 ? i : i - 1)
  }, [status, t, goToStage])

  const reset = useCallback(() => {
    setT(0)
    setStatus('off')
  }, [])

  const cycleSpeed = useCallback(() => {
    setSpeed((sp) => SPEEDS[(SPEEDS.indexOf(sp) + 1) % SPEEDS.length])
  }, [])

  return useMemo(
    () => ({
      t,
      status,
      speed,
      setSpeed,
      cycleSpeed,
      stageIndex,
      stageProgress,
      progress,
      stage: STAGES[stageIndex],
      isOn: status !== 'off',
      power,
      togglePause,
      goToStage,
      nextStage,
      prevStage,
      reset,
    }),
    [t, status, speed, cycleSpeed, stageIndex, stageProgress, progress, power, togglePause, goToStage, nextStage, prevStage, reset],
  )
}

/** prefers-reduced-motion holatini kuzatadi */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}
