import { useEffect, useRef, useState } from 'react'
import { LEADERS, SUBTEAMS, TEAM_PAGE } from '../data/team.js'

const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches

const initials = (name) => name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map((p) => p[0]).join('').slice(0, 2)

/**
 * Portrait slot: shows the real photo from /team/<id>.jpg once it has loaded; until then (or if the
 * file doesn't exist) a labelled initials placeholder fills the same box, so layout never shifts.
 */
function Portrait({ member }) {
  const [state, setState] = useState('pending') // pending | loaded | missing
  return (
    <div className="portrait">
      {state !== 'loaded' && (
        <div className="portrait__ph" role="img" aria-label={`Portrait placeholder for ${member.name}`}>
          <span aria-hidden>{initials(member.name)}</span>
          <small aria-hidden>Photo to come</small>
        </div>
      )}
      {state !== 'missing' && (
        <img
          className={state === 'loaded' ? 'is-loaded' : ''}
          src={`/team/${member.id}.jpg`}
          alt={`Portrait of ${member.name}${member.title ? `, ${member.title}` : ''}`}
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('missing')}
        />
      )}
    </div>
  )
}

function Years({ year }) {
  const n = parseInt(year, 10) || 0
  return (
    <p className="member__year">
      <span className="pips" aria-hidden>
        {[1, 2, 3, 4].map((i) => <i key={i} className={i <= n ? 'on' : ''} />)}
      </span>
      Year {n}<span className="sr-only"> on the team</span>
    </p>
  )
}

function MemberCard({ member, leader }) {
  const meta = [member.grade, member.school].filter(Boolean).join(' · ')
  const skills = TEAM_PAGE.skills[member.id] || []
  const fact = TEAM_PAGE.funFacts[member.id]
  const lead = !leader && Boolean(member.title)
  return (
    <article className={`member${leader ? ' member--leader' : ''}${lead ? ' member--lead' : ''}`}>
      <Portrait member={member} />
      <div className="member__body">
        {/* rendered even when empty so names line up across a row */}
        <p className="member__title">{lead ? <span className="lead-label">{member.title}</span> : member.title}</p>
        <h3 className="member__name">{member.name}</h3>
        <p className="member__meta">{meta}</p>
        <Years year={member.year} />
        <p className="member__desc">{member.description}</p>
        <ul className="tags" aria-label="Skills">
          {skills.map((t) => <li key={t}>{t}</li>)}
        </ul>
        {fact && <p className="member__fact"><span>Fun fact</span> {fact}</p>}
      </div>
    </article>
  )
}

const NAV = [{ id: 'all', title: 'All' }, ...SUBTEAMS]

export default function TeamPage() {
  const root = useRef(null)
  const bar = useRef(null)
  const [active, setActive] = useState('all')

  // Highlight whichever subteam crosses a thin band ~30% down the viewport; nothing there = "All".
  useEffect(() => {
    const scroller = root.current.closest('.left')
    const hits = new Set()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? hits.add(e.target.dataset.sub) : hits.delete(e.target.dataset.sub)))
      setActive(SUBTEAMS.find((s) => hits.has(s.id))?.id || 'all')
    }, { root: scroller, rootMargin: '-30% 0px -69% 0px' })
    root.current.querySelectorAll('.sub').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Keep the active link visible when the bar scrolls sideways on narrow screens.
  useEffect(() => {
    const nav = bar.current
    const link = nav?.querySelector('[aria-current]')
    if (link && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: link.offsetLeft - 16, behavior: motionOK() ? 'smooth' : 'auto' })
    }
  }, [active])

  // Cards fade up once as they enter; each batch staggers by 60ms. Skipped entirely with reduced motion.
  useEffect(() => {
    if (!motionOK()) return
    const el = root.current
    const cards = [...el.querySelectorAll('.member')]
    el.classList.add('team--anim')
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        e.target.style.transitionDelay = `${i * 60}ms`
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      })
    }, { root: el.closest('.left'), rootMargin: '0px 0px -8% 0px' })
    cards.forEach((c) => io.observe(c))
    // drop the delay once the entrance is over so hover responds immediately
    const clear = (e) => { if (e.propertyName === 'opacity') e.target.style.transitionDelay = '' }
    el.addEventListener('transitionend', clear)
    return () => { io.disconnect(); el.removeEventListener('transitionend', clear) }
  }, [])

  const go = (e, id) => {
    e.preventDefault()
    const behavior = motionOK() ? 'smooth' : 'auto'
    if (id === 'all') root.current.closest('.left').scrollTo({ top: 0, behavior })
    else document.getElementById(`team-${id}`).scrollIntoView({ behavior, block: 'start' })
    history.replaceState(null, '', id === 'all' ? '#team' : `#team-${id}`)
  }

  return (
    <div className="team" ref={root}>
      <header className="team__head wrap">
        <h1 className="team__title">Meet the Team</h1>
        <p className="lead team__intro">{TEAM_PAGE.intro}</p>
      </header>

      <nav className="subnav" aria-label="Subteams">
        <ul className="subnav__list wrap" ref={bar}>
          {NAV.map((s) => (
            <li key={s.id}>
              <a
                href={s.id === 'all' ? '#team' : `#team-${s.id}`}
                className={`subnav__link sn--${s.id}`}
                aria-current={active === s.id ? 'true' : undefined}
                onClick={(e) => go(e, s.id)}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="team-leadership" className="leaders wrap" aria-labelledby="leaders-h">
        <h2 id="leaders-h" className="team__label">Leadership</h2>
        <div className="leaders__grid">
          {LEADERS.map((m) => <MemberCard key={m.id} member={m} leader />)}
        </div>
        {TEAM_PAGE.seasonGoal && (
          <p className="goal"><span>This season’s goal</span> {TEAM_PAGE.seasonGoal}</p>
        )}
      </section>

      {SUBTEAMS.map((s) => (
        <section key={s.id} id={`team-${s.id}`} data-sub={s.id} className={`sub sub--${s.id}`} aria-labelledby={`${s.id}-h`}>
          <div className="sub__pat" aria-hidden><i /></div>
          <div className="wrap">
            <header className="sub__head">
              <h2 id={`${s.id}-h`} className="sub__title">{s.title}</h2>
              <p className="sub__about">
                {TEAM_PAGE.subteams[s.id]}
                <span className="sub__count">{s.members.length} members</span>
              </p>
            </header>
            <div className={`sub__grid${s.members.length === 4 ? ' sub__grid--four' : ''}`}>
              {s.members.map((m) => <MemberCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      ))}

      <section className="close wrap" aria-label="Team at a glance">
        <dl className="stats">
          {TEAM_PAGE.stats.map((st) => (
            <div key={st.label}><dt>{st.label}</dt><dd>{st.value}</dd></div>
          ))}
        </dl>
        <div className="cta">
          {TEAM_PAGE.cta.map((c) => (
            <a key={c.label} href={c.href} className={`btn${c.primary ? ' btn--primary' : ''}`}>{c.label}</a>
          ))}
        </div>
      </section>
    </div>
  )
}
