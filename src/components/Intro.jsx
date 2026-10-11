import { useEffect, useMemo, useRef } from 'react'

const BLADES = 8
const T_SPIN = 1700 // gear accelerates + dial climbs
const T_OPEN = 1000 // iris opens
const FAILSAFE = T_SPIN + T_OPEN + 1500

function gearPath(teeth = 16, outer = 46, root = 37, hole = 11) {
  const step = (Math.PI * 2) / teeth
  const pt = (r, a) => `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    d += `${i ? 'L' : 'M'}${pt(root, a)} L${pt(outer, a + step * 0.14)} L${pt(outer, a + step * 0.36)} L${pt(root, a + step * 0.5)} `
  }
  return d + `Z M${hole},0 A${hole},${hole} 0 1,0 ${-hole},0 A${hole},${hole} 0 1,0 ${hole},0 Z`
}

function Dial({ needleRef }) {
  const ticks = Array.from({ length: 13 }, (_, i) => -60 + i * 10)
  return (
    <svg className="intro__dial" viewBox="-60 -50 120 70" aria-hidden>
      <path d="M-46 0 A46 46 0 0 1 46 0" fill="none" stroke="#e4e1ee" strokeWidth="5" />
      <path d="M26 -37.5 A46 46 0 0 1 46 0" fill="none" stroke="#8f3ba5" strokeWidth="5" />
      {ticks.map((a) => (
        <line key={a} x1="0" y1="-40" x2="0" y2={a % 30 === 0 ? -33 : -36} stroke="#111" strokeWidth={a % 30 === 0 ? 1.4 : 0.8} transform={`rotate(${a})`} />
      ))}
      <g ref={needleRef} transform="rotate(-60)">
        <line x1="0" y1="4" x2="0" y2="-38" stroke="#8f3ba5" strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle r="4" fill="#111" />
      <text x="0" y="16" textAnchor="middle" fontSize="6.5" fontWeight="800" letterSpacing="1.6" fill="#111">OVERDRIVE</text>
    </svg>
  )
}

/**
 * Intro: gear spins up (dial climbs to OVERDRIVE) -> 8-blade camera iris opens -> homepage.
 * The homepage is already mounted underneath. Driven by one rAF loop; always ends via onDone.
 */
export default function Intro({ onDone }) {
  const root = useRef(null)
  const gear = useRef(null)
  const needle = useRef(null)
  const d = useMemo(() => gearPath(), [])

  useEffect(() => {
    let raf, done = false
    const finish = () => { if (!done) { done = true; cancelAnimationFrame(raf); onDone() } }
    const t0 = performance.now()
    const fail = setTimeout(finish, FAILSAFE)
    const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish() }
    window.addEventListener('keydown', onKey)
    const MAX = 1500 // deg/s at full overdrive
    const tick = (now) => {
      const t = now - t0
      const u = Math.min(1, t / T_SPIN)
      // angle = integral of omega(u) = MAX*u^2 (ease-in) over T_SPIN
      const spinAngle = (MAX * (T_SPIN / 1000) * u ** 3) / 3
      const extra = t > T_SPIN ? (MAX * (t - T_SPIN)) / 1000 : 0
      gear.current?.setAttribute('transform', `rotate(${(spinAngle + extra) % 360})`)
      needle.current?.setAttribute('transform', `rotate(${-60 + 120 * (1 - (1 - u) ** 2)})`)
      if (t >= T_SPIN && !root.current?.classList.contains('is-opening')) root.current?.classList.add('is-opening')
      if (t >= T_SPIN + T_OPEN) return finish()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { done = true; cancelAnimationFrame(raf); clearTimeout(fail); window.removeEventListener('keydown', onKey) }
  }, [onDone])

  return (
    <div className="intro" ref={root} role="dialog" aria-label="Loading Overdrive">
      {/* closed camera iris: overlapping blades that rotate outward */}
      <svg className="intro__iris" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {Array.from({ length: BLADES }, (_, i) => (
          <g key={i} transform={`rotate(${(360 / BLADES) * i})`}>
            <g className="blade" style={{ '--k': i }}>
              <path d="M-3 -62 L-3 400 L500 400 L500 -62 Z" fill="#fff" stroke="#d9d4ea" strokeWidth="0.4" />
              <path d="M-3 -62 L-3 400" stroke="#8f3ba5" strokeWidth="0.5" />
            </g>
          </g>
        ))}
      </svg>
      <div className="intro__stage">
        <svg className="intro__gear" viewBox="-50 -50 100 100" aria-hidden>
          <g ref={gear}>
            <path d={d} fill="#f6f3ff" stroke="#111" strokeWidth="1.6" fillRule="evenodd" strokeLinejoin="round" />
            <circle r="27" fill="none" stroke="#8f3ba5" strokeWidth="2.2" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <circle key={a} r="2.4" cx="19" fill="#111" transform={`rotate(${a})`} />
            ))}
          </g>
        </svg>
        <Dial needleRef={needle} />
        <p className="intro__word">Overdrive <b>17294</b></p>
      </div>
      <button className="intro__skip" onClick={onDone}>Skip</button>
    </div>
  )
}
