import { useEffect, useRef, useState } from 'react'
import { LEADERS, SUBTEAMS, TEAM_PAGE } from '../data/team.js'
import { SEASONS } from '../data/awards.js'
import YearBar from './ui/YearBar.jsx'
import Pennant from './ui/Pennant.jsx'
import StatsStrip from './ui/StatsStrip.jsx'

const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches

const initials = (name) => name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map((p) => p[0]).join('').slice(0, 2)

/**
 * Portrait slot: shows the member's photo once it has loaded; until then (or if there is no photo
 * or it fails to load) a labelled initials placeholder fills the same box, so layout never shifts.
 */
function Portrait({ member }) {
  const [state, setState] = useState(member.photo ? 'pending' : 'missing') // pending | loaded | missing
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
          src={member.photo}
          style={{
            objectPosition: member.focus,
            // scale around the upper middle, where the face sits once `focus` has placed it
            ...(member.zoom && { transform: `scale(${member.zoom})`, transformOrigin: '50% 35%' }),
          }}
          alt={`Portrait of ${member.name}${member.title ? `, ${member.title}` : ''}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('missing')}
        />
      )}
    </div>
  )
}

function MemberCard({ member, leader }) {
  const skills = TEAM_PAGE.skills[member.id] || []
  const fact = TEAM_PAGE.funFacts[member.id]
  const lead = !leader && Boolean(member.title)
  const meta = [member.grade, member.school].filter(Boolean).join(' · ')
  return (
    <article className={`member${leader ? ' member--leader' : ''}${lead ? ' member--lead' : ''}`}>
      <Portrait member={member} />
      <div className="member__body">
        <h3 className="member__name">{member.name}</h3>
        {/* role line is always rendered (it may hold only grade and school) so rows line up */}
        <p className="member__meta">
          {lead && <span className="lead-badge">{member.title}</span>}
          {leader && <span className="member__role">{member.title}</span>}
          <span>{meta}</span>
        </p>
        <p className="member__year"><YearBar n={parseInt(member.year, 10) || 0} /></p>
        <p className="member__desc">{member.description}</p>
        <ul className="tags" aria-label="Skills">
          {skills.map((t) => <li key={t}>{t}</li>)}
        </ul>
        {fact && <p className="member__fact"><span>Fun fact</span> {fact}</p>}
      </div>
    </article>
  )
}

// Header stats, computed from the data.
const MEMBERS = LEADERS.length + SUBTEAMS.reduce((n, s) => n + s.members.length, 0)
const STATS = [
  { label: 'Members', value: MEMBERS },
  { label: 'Subteams', value: SUBTEAMS.length },
  { label: 'Subteam leads', value: SUBTEAMS.reduce((n, s) => n + s.members.filter((m) => m.title).length, 0) },
  { label: 'Seasons competed', value: SEASONS.length },
]

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

  // Cards rise in once, 60ms apart within each batch (same motion as the Awards page). Skipped with reduced motion.
  useEffect(() => {
    if (!motionOK()) return
    const el = root.current
    el.classList.add('team--anim')
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        e.target.style.setProperty('--delay', `${i * 60}ms`)
        e.target.dataset.in = ''
        io.unobserve(e.target)
      })
    }, { root: el.closest('.left'), rootMargin: '0px 0px -8% 0px' })
    el.querySelectorAll('.member').forEach((c) => io.observe(c))
    return () => io.disconnect()
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
        <h1 className="outlined display-title">Meet the Team</h1>
        <p className="lead team__intro">{TEAM_PAGE.intro}</p>
      </header>
      <div className="wrap"><StatsStrip items={STATS} className="team__stats" /></div>

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
        <div className="tbanner">
          <Pennant id="leaders-h" className="tbanner__pennant"><span className="outlined">Leadership</span></Pennant>
          <p className="tbanner__about">Captain and vice captain<span className="tbanner__count">{LEADERS.length} members</span></p>
        </div>
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
            <div className="tbanner">
              <Pennant id={`${s.id}-h`} className="tbanner__pennant"><span className="outlined">{s.title}</span></Pennant>
              <p className="tbanner__about">
                {TEAM_PAGE.subteams[s.id]}
                <span className="tbanner__count">{s.members.length} members</span>
              </p>
            </div>
            <div className={`sub__grid${s.members.length === 4 ? ' sub__grid--four' : ''}`}>
              {s.members.map((m) => <MemberCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      ))}

      <section className="team__close wrap" aria-labelledby="join-h">
        <p id="join-h" className="team__ask">Want to join?</p>
        <div className="cta">
          {TEAM_PAGE.cta.map((c) => (
            <a key={c.label} href={c.href} className={`btn${c.primary ? ' btn--primary' : ''}`}>{c.label}</a>
          ))}
        </div>
      </section>
    </div>
  )
}
