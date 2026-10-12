import { useEffect, useRef } from 'react'
import { AWARDS_INTRO, SEASONS, TROPHIES } from '../data/awards.js'

const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches

function Trophy({ kind }) {
  const t = TROPHIES[kind]
  if (!t) return <div className="trophy trophy--empty" aria-hidden />
  return (
    <div className="trophy">
      <img src={t.src} width={t.w} height={t.h} alt={kind === 'uil' ? "Overdrive's UIL State Championship trophy" : ''} loading="lazy" decoding="async" />
    </div>
  )
}

function Award({ award, season, side }) {
  const { events, verified = true } = award
  const many = events.length > 1
  return (
    <li className={`award award--${side}${award.milestone ? ' award--milestone' : ''}`}>
      <div className="award__inner">
        <Trophy kind={award.trophy} />
        <div className="award__text">
          {!many && (
            <p className="award__date">
              {verified && events[0].date
                ? <time dateTime={events[0].iso}>{events[0].date}</time>
                : `${season} season`}
            </p>
          )}
          <h3 className="award__title">
            {award.count > 1 && <span className="award__count">{award.count}× </span>}
            {award.title}
          </h3>
          {award.detail && <p className="award__detail">{award.detail}</p>}
          {many ? (
            <ul className="award__events">
              {events.map((e) => (
                <li key={e.name}>
                  <time dateTime={e.iso}>{e.date}</time>
                  <a href={e.source} target="_blank" rel="noreferrer">{e.name}<span className="sr-only"> (FIRST event record, opens in a new tab)</span></a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="award__event">
              {events[0].name}
              {events[0].place && <span className="award__place"> · {events[0].place}</span>}
            </p>
          )}
          {many ? null : verified ? (
            <a className="award__src" href={events[0].source} target="_blank" rel="noreferrer">
              FIRST event record<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <p className="award__flag">Not yet matched to an official FIRST event record.</p>
          )}
        </div>
      </div>
    </li>
  )
}

export default function AwardsPage() {
  const root = useRef(null)
  const line = useRef(null)

  // The purple part of the line follows how far the reader has scrolled through the timeline.
  // Read-only: it observes native scrolling and never changes it.
  useEffect(() => {
    const scroller = root.current.closest('.left')
    const tl = line.current
    let raf = 0
    const update = () => {
      raf = 0
      const r = tl.getBoundingClientRect()
      const mid = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.6
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height))
      tl.style.setProperty('--fill', p.toFixed(4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => { scroller.removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // Entries fade up once as they enter. Skipped with reduced motion.
  useEffect(() => {
    if (!motionOK()) return
    const el = root.current
    el.classList.add('awards--anim')
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        e.target.style.transitionDelay = `${i * 60}ms`
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      })
    }, { root: el.closest('.left'), rootMargin: '0px 0px -8% 0px' })
    el.querySelectorAll('.award, .season__head').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  let n = 0 // running index so sides keep alternating across seasons
  return (
    <div className="awards" ref={root}>
      <header className="awards__head wrap">
        <h1 className="team__title">Our Awards</h1>
        <p className="lead">{AWARDS_INTRO}</p>
      </header>

      <div className="tl wrap">
        <div className="tl__line" ref={line}>
          {SEASONS.map((s) => (
            <section key={s.season} className="season" aria-labelledby={`season-${s.season}`}>
              <header className="season__head">
                <h2 id={`season-${s.season}`} className="season__year">{s.season}</h2>
                <p className="season__game">{s.game}{s.note ? ` · ${s.note}` : ''}</p>
              </header>
              <ol className="season__list">
                {s.awards.map((a) => <Award key={a.id} award={a} season={s.season} side={n++ % 2 ? 'right' : 'left'} />)}
              </ol>
            </section>
          ))}
        </div>
        <p className="tl__end">
          Dates and placings are taken from FIRST's official records for{' '}
          <a href="https://ftc-events.firstinspires.org/team/17294" target="_blank" rel="noreferrer">team 17294<span className="sr-only"> (opens in a new tab)</span></a>.
        </p>
      </div>
    </div>
  )
}
