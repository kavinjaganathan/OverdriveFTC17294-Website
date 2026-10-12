import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ALUMNI, COLLEGES, PREVIEW_UNCONFIRMED } from 'virtual:alumni'
import { CONTACT } from '../config.js'
import YearBar from './ui/YearBar.jsx'
import Pennant from './ui/Pennant.jsx'

const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches
const SUBTEAMS = ['Building', 'Programming', 'CAD', 'Outreach']

// Second line of defence: the build already drops unpublished entries (see vite.config.js).
const VISIBLE = ALUMNI.filter((a) => PREVIEW_UNCONFIRMED || a.confirmed === true)

const nameOf = (a) => a.displayName || a.name
const initials = (s) => s.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
const STOP = new Set(['The', 'of', 'at'])
const monogram = (c) => c.monogram || c.name.split(' ').filter((w) => !STOP.has(w)).map((w) => w.replace(/[^A-Z]/g, '') || w[0]).join('')
const collegeOf = (a) => (!a.hideCollege && COLLEGES[a.college]) || null
// Subteam class, only for a recognised subteam; anything else falls back to the neutral styling.
const stClass = (a) => (SUBTEAMS.includes(a.subteam) ? ` st--${a.subteam.toLowerCase()}` : '')

// Official seal on a neutral plate, scaled to a common height and never cropped or recoloured.
// Without a logo file the plate shows the school's initials as plain text.
function Seal({ college }) {
  if (!college) return <span className="seal seal--none"><span>Not listed</span></span>
  if (college.logo) {
    return (
      <span className="seal">
        <img src={college.logo} width="64" height="64" loading="lazy" decoding="async" alt={`${college.name} seal`} />
      </span>
    )
  }
  return <span className="seal seal--text" aria-hidden>{monogram(college)}</span>
}

// Small shield with the team's stripes and a purple band carrying the two-digit class year.
function ClassBadge({ year }) {
  const yy = String(year).slice(-2)
  return (
    <svg className="alum__badge" viewBox="0 0 40 46" width="40" height="46" role="img" aria-label={`Class of ${year}`}>
      <defs>
        <pattern id="alum-stripes" width="6" height="46" patternUnits="userSpaceOnUse">
          <rect width="3" height="46" fill="#2f2e29" />
          <rect x="3" width="3" height="46" fill="#e0daca" />
        </pattern>
      </defs>
      <path d="M2 2h36v22c0 11-8 17-18 20C10 41 2 35 2 24z" fill="url(#alum-stripes)" stroke="var(--alum-line)" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="1" y="15" width="38" height="14" fill="var(--purple)" stroke="var(--alum-line)" strokeWidth="2" />
      <text x="20" y="25.6" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800" fontFamily="inherit">’{yy}</text>
    </svg>
  )
}

function AlumCard({ a, cardRef }) {
  const [open, setOpen] = useState(false)
  const frontBtn = useRef(null)
  const backBtn = useRef(null)
  const college = collegeOf(a)
  const name = nameOf(a)
  const hasYears = Number.isFinite(a.yearsOnTeam) && a.yearsOnTeam > 0
  const advice = a.advice?.trim()
  const backId = `advice-${a.id}`

  const toggle = (next) => {
    setOpen(next)
    // move focus to the control on the face that is now showing
    requestAnimationFrame(() => (next ? backBtn : frontBtn).current?.focus({ preventScroll: true }))
  }

  return (
    <article ref={cardRef} className={`alum${stClass(a)}${open ? ' is-open' : ''}`} aria-labelledby={`alum-${a.id}`}>
      <div className="alum__flip">
        <div className="alum__front" inert={open && advice ? true : undefined}>
          <div className="alum__photo">
            {a.photo ? (
              <img src={a.photo} width="400" height="300" loading="lazy" decoding="async" alt={`Portrait of ${name}`} />
            ) : (
              <span className="alum__mono" aria-hidden>{initials(name)}</span>
            )}
            <ClassBadge year={a.classYear} />
            {PREVIEW_UNCONFIRMED && !a.confirmed && <span className="alum__pending">Pending</span>}
          </div>
          <h3 id={`alum-${a.id}`} className="alum__name">{name}</h3>
          {/* empty slots stay in the DOM (with no text) so later rows line up across cards */}
          <p className="alum__meta">
            {a.role && <span className="alum__role">{a.role}</span>}
            {hasYears && <YearBar n={a.yearsOnTeam} />}
          </p>
          <div className="alum__college">
            <Seal college={college} />
            <p>
              <span className="alum__school">{college ? college.name : 'College not listed'}</span>
              {college && a.major && <span className="alum__major">{a.major}</span>}
            </p>
          </div>
          <p className={`alum__summary${a.summary ? '' : ' alum__summary--empty'}`}>{a.summary || 'Update coming soon'}</p>
          <div className="alum__actions">
            {advice && (
              <button ref={frontBtn} type="button" className="alum__flipbtn" aria-expanded={open} aria-controls={backId} onClick={() => toggle(true)}>
                Advice from {name}
              </button>
            )}
          </div>
        </div>
        {advice && (
          <div id={backId} className="alum__back" inert={open ? undefined : true}>
            <blockquote className="alum__quote">
              <p>{advice}</p>
              <footer>{name}, Class of {a.classYear}</footer>
            </blockquote>
            <button ref={backBtn} type="button" className="alum__flipbtn" aria-expanded={open} aria-controls={backId} onClick={() => toggle(false)}>
              Back to profile
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default function AlumniPage() {
  const root = useRef(null)
  const cards = useRef(new Map())
  const rects = useRef(new Map())
  const [cls, setCls] = useState('all')

  const classes = useMemo(() => [...new Set(VISIBLE.map((a) => a.classYear))].sort((x, y) => y - x), [])
  const shown = VISIBLE.filter((a) => cls === 'all' || a.classYear === cls)

  // FLIP: cards that stay on screen glide from their old position to the new one.
  useLayoutEffect(() => {
    const base = root.current.getBoundingClientRect()
    const next = new Map()
    cards.current.forEach((el, id) => {
      const r = el.getBoundingClientRect()
      next.set(id, { x: r.left - base.left, y: r.top - base.top })
      const prev = rects.current.get(id)
      if (prev && motionOK()) {
        const dx = prev.x - (r.left - base.left)
        const dy = prev.y - (r.top - base.top)
        if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2, .7, .2, 1)' })
      }
    })
    rects.current = next
  }, [cls])

  // Cards scale/fade in on entry, 60ms apart within each batch. Cards that come back after a
  // filter change are observed again so they don't stay hidden.
  const io = useRef(null)
  useEffect(() => {
    if (!motionOK()) return
    const el = root.current
    el.classList.add('alumni--anim')
    io.current = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        e.target.style.transitionDelay = `${i * 60}ms`
        e.target.dataset.in = '' // a data attribute, so React re-renders of className don't drop it
        io.current.unobserve(e.target)
      })
    }, { root: el.closest('.left'), rootMargin: '0px 0px -8% 0px' })
    const clear = (e) => { if (e.propertyName === 'opacity') e.target.style.transitionDelay = '' }
    el.addEventListener('transitionend', clear)
    return () => { io.current.disconnect(); io.current = null; el.removeEventListener('transitionend', clear) }
  }, [])
  useEffect(() => {
    root.current.querySelectorAll('.alum:not([data-in])').forEach((c) => io.current?.observe(c))
  }, [cls])

  const setRef = (id) => (el) => { if (el) cards.current.set(id, el); else cards.current.delete(id) }
  const mail = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Alumni page update')}`

  return (
    <div className="alumni" ref={root}>
      <header className="alumni__head wrap">
        <h1 className="outlined display-title">Alumni</h1>
        <p className="lead">Seven seasons of builders. Here's where they went next.</p>
      </header>

      {VISIBLE.length === 0 ? (
        <section className="alumni__empty wrap" aria-label="Alumni">
          <p className="alumni__empty-title">Alumni profiles are on the way</p>
          <p className="lead">We're collecting updates from former members and will list them here once they've signed off.</p>
        </section>
      ) : (
        <>
          <div className="afilter wrap" role="group" aria-label="Filter by class">
            {['all', ...classes].map((c) => (
              <button key={c} type="button" className="afilter__btn" aria-pressed={cls === c} onClick={() => setCls(c)}>
                {c === 'all' ? 'All' : `Class of ${c}`}
              </button>
            ))}
          </div>

          {classes.map((y) => {
            const people = shown.filter((a) => a.classYear === y)
            if (!people.length) return null
            return (
              <section key={y} className="aclass wrap" aria-labelledby={`class-${y}`}>
                <div className="aclass__head">
                  <Pennant id={`class-${y}`}><span className="outlined">Class of {y}</span></Pennant>
                  <p className="aclass__count">{people.length} {people.length === 1 ? 'alum' : 'alumni'}</p>
                </div>
                <div className="aclass__grid">
                  {people.map((a) => <AlumCard key={a.id} a={a} cardRef={setRef(a.id)} />)}
                </div>
              </section>
            )
          })}
        </>
      )}

      <section className="alumni__close wrap" aria-label="Alumni updates">
        <p className="alumni__ask">Are you an alum? Send us an update.</p>
        <div className="cta">
          <a className="btn btn--primary" href={mail}>Email {CONTACT.email}</a>
          <a className="btn" href="#contact">Sponsor us</a>
        </div>
      </section>
    </div>
  )
}
