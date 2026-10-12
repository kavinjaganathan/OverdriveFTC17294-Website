import { useEffect, useRef, useState } from 'react'
import { AWARDS_INTRO, SEASONS, TROPHIES } from '../data/awards.js'
import Pennant from './ui/Pennant.jsx'
import StatsStrip from './ui/StatsStrip.jsx'

const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches

const TIER_LABEL = { state: 'State title', alliance: 'Alliance', judged: 'Judged award' }
const tierOf = (a) => a.tier || (a.milestone || /State/.test(a.title) ? 'state' : /Alliance|Ranked/.test(a.title) ? 'alliance' : 'judged')
const countOf = (a) => a.count || 1
const shortSeason = (s) => `’${s.slice(2, 4)}–${s.slice(7, 9)}`

// Header stats, computed from the data. Entries not matched to a FIRST record are left out.
const VERIFIED = SEASONS.flatMap((s) => s.awards).filter((a) => a.verified !== false)
const STATS = [
  { label: 'Total awards', value: VERIFIED.reduce((n, a) => n + countOf(a), 0) },
  { label: 'Seasons competed', value: SEASONS.length },
  { label: 'State titles', value: VERIFIED.filter((a) => tierOf(a) === 'state').reduce((n, a) => n + countOf(a), 0) },
  { label: 'Judged awards', value: VERIFIED.filter((a) => tierOf(a) === 'judged').reduce((n, a) => n + countOf(a), 0) },
]

// Two cards per row, left then right. A season with a single award alternates sides so the road
// doesn't lean one way.
function layout(season, si) {
  const startRight = season.awards.length === 1 && si % 2 === 1
  return season.awards.map((a, i) => {
    const k = i + (startRight ? 1 : 0)
    return { a, side: k % 2 ? 'right' : 'left', row: Math.floor(k / 2) * 6 + 1 }
  })
}

function dateRange(events) {
  if (events.length === 1) return events[0].date
  const first = events[events.length - 1].date
  const last = events[0].date
  const yr = last.slice(-4)
  return `${first.endsWith(yr) ? first.slice(0, -6) : first} – ${last}`
}

function Medal({ award }) {
  const t = TROPHIES[award.trophy]
  return (
    <div className="medal">
      {t ? (
        <img src={t.src} width={t.w} height={t.h} loading="lazy" decoding="async" alt={award.trophy === 'uil' ? "Overdrive's UIL State Championship trophy" : ''} />
      ) : null}
      {award.count > 1 && <span className="medal__count" aria-hidden>×{award.count}</span>}
    </div>
  )
}

function Award({ award, season, side, row }) {
  const { events, verified = true } = award
  const many = events.length > 1
  const tier = tierOf(award)
  return (
    <li className={`award award--${side} tier--${tier}${award.milestone ? ' award--state' : ''}`} style={{ '--rs': row, '--col': side === 'left' ? 1 : 3 }}>
      <span className="award__node" aria-hidden />
      {award.milestone && <span className="award__shine" aria-hidden />}
      <Medal award={award} />
      <p className="award__tier">{TIER_LABEL[tier]}</p>
      <p className="award__date">
        {verified && events[0].date ? <time dateTime={events[0].iso}>{dateRange(events)}</time> : `${season} season`}
      </p>
      <h3 className="award__title">
        {award.count > 1 && <span className="sr-only">{award.count} × </span>}
        {award.title}
      </h3>
      <p className="award__detail">{award.detail}</p>
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
      <p className="award__foot">
        {many ? null : verified ? (
          <a className="award__src" href={events[0].source} target="_blank" rel="noreferrer">
            FIRST event record<span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <em className="award__flag">Not yet matched to an official FIRST event record.</em>
        )}
      </p>
    </li>
  )
}

function SeasonLogo({ season, className }) {
  if (!season.logo) return <span className={`${className} ${className}--text`}>{season.season}</span>
  return <img className={className} src={season.logo.src} width={season.logo.w} height={season.logo.h} alt="" decoding="async" />
}

export default function AwardsPage() {
  const root = useRef(null)
  const road = useRef(null)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)

  // Road progress + node fill. Read-only: observes native scrolling, never changes it.
  useEffect(() => {
    const scroller = root.current.closest('.left')
    const el = road.current
    const nodes = [...el.querySelectorAll('.award__node')]
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const mark = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.55
      el.style.setProperty('--fill', Math.min(1, Math.max(0, (mark - r.top) / r.height)).toFixed(4))
      nodes.forEach((n) => n.classList.toggle('is-reached', n.getBoundingClientRect().top < mark))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => { scroller.removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // Active season for the corner badge and the jump rail; badge shows only while the road is on screen.
  useEffect(() => {
    const scroller = root.current.closest('.left')
    const seasons = [...road.current.querySelectorAll('.season')]
    const hits = new Set()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? hits.add(e.target) : hits.delete(e.target)))
      // if the band straddles two seasons, the lower one (the one being entered) wins
      const i = Math.max(...[...hits].map((el) => seasons.indexOf(el)))
      if (i >= 0) setActive(i)
    }, { root: scroller, rootMargin: '-45% 0px -50% 0px' })
    seasons.forEach((s) => io.observe(s))
    const vis = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { root: scroller })
    vis.observe(road.current)
    return () => { io.disconnect(); vis.disconnect() }
  }, [])

  // Cards (with their nodes) rise in once, 60ms apart within each season.
  useEffect(() => {
    if (!motionOK()) return
    const el = root.current
    el.classList.add('awards--anim')
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        e.target.style.setProperty('--delay', `${i * 60}ms`)
        e.target.dataset.in = ''
        io.unobserve(e.target)
      })
    }, { root: el.closest('.left'), rootMargin: '0px 0px -8% 0px' })
    el.querySelectorAll('.award').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  const jump = (i) => {
    road.current.querySelectorAll('.season')[i].scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block: 'start' })
  }

  return (
    <div className="awards" ref={root}>
      <header className="awards__head wrap">
        <h1 className="outlined display-title">Our Awards</h1>
        <p className="lead">{AWARDS_INTRO}</p>
      </header>
      <div className="wrap">
        <StatsStrip items={STATS} className="awards__stats" />
      </div>

      {/* fixed corner badge: every logo is mounted (so all are preloaded); only the active one shows */}
      <div className={`sbadge${inView ? ' is-visible' : ''}`} aria-hidden>
        <div className="sbadge__plate">
          {SEASONS.map((s, i) => (
            <span key={s.season} className={`sbadge__logo${i === active ? ' is-active' : ''}`}>
              <SeasonLogo season={s} className="sbadge__img" />
            </span>
          ))}
        </div>
        <span className="sbadge__years outlined">{SEASONS[active].season}</span>
      </div>

      <nav className={`srail${inView ? ' is-visible' : ''}`} aria-label="Jump to season">
        <ol>
          {SEASONS.map((s, i) => (
            <li key={s.season}>
              <button type="button" aria-current={i === active ? 'true' : undefined} onClick={() => jump(i)}>
                {shortSeason(s.season)}<span className="sr-only"> season ({s.season})</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="tl wrap">
        <div className="tl__road" ref={road}>
          <span className="road" aria-hidden><span className="road__fill" /></span>
          <p className="endcap"><span className="endcap__node" aria-hidden /><span className="endcap__text">More to come…</span></p>
          <ol className="seasons">
            {SEASONS.map((s, si) => {
              const total = s.awards.reduce((n, a) => n + countOf(a), 0)
              return (
                <li key={s.season} className={`season season--${s.game.toLowerCase().replace(/\s+/g, '-')}`} aria-labelledby={`season-${si}`}>
                  <span className="season__pat" aria-hidden />
                  <div className="season__head">
                    <Pennant id={`season-${si}`} className="season__pennant">
                      <span className="season__logo-plate"><SeasonLogo season={s} className="season__logo" /></span>
                      <span className="outlined">{s.season}</span>
                    </Pennant>
                    <p className="season__game">
                      {s.game}{s.note ? ` · ${s.note}` : ''}
                      <span className="season__count">{total} {total === 1 ? 'award' : 'awards'}</span>
                    </p>
                  </div>
                  <ol className="season__list">
                    {layout(s, si).map(({ a, side, row }) => <Award key={a.id} award={a} season={s.season} side={side} row={row} />)}
                  </ol>
                </li>
              )
            })}
          </ol>
        </div>

        <section className="tl__close" aria-labelledby="tl-close-h">
          <p id="tl-close-h" className="tl__ask">Help us add to this list</p>
          <div className="cta"><a className="btn btn--primary" href="#contact">Sponsor us</a></div>
          <p className="tl__end">
            Dates and placings are taken from FIRST's official records for{' '}
            <a href="https://ftc-events.firstinspires.org/team/17294" target="_blank" rel="noreferrer">team 17294<span className="sr-only"> (opens in a new tab)</span></a>.
          </p>
        </section>
      </div>
    </div>
  )
}
