import { useCallback, useEffect, useRef, useState } from 'react'
import FolderNav from './components/FolderNav.jsx'
import Intro from './components/Intro.jsx'
import LogoPanel from './components/LogoPanel.jsx'
import TeamPage from './components/TeamPage.jsx'
import AwardsPage from './components/AwardsPage.jsx'
import AlumniPage from './components/AlumniPage.jsx'
import { Champions, Engineering, Footer, Hero, Identity, Sustainability } from './components/Sections.jsx'
import { updateProgress } from './scrollStore.js'

const shouldIntro = () => {
  try {
    return !sessionStorage.getItem('od-intro') && !matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch { return false }
}

// Hash routes: #home (default), #awards, #alumni, #team, and #team-<subteam> to land on a section.
const parseHash = () => {
  const h = location.hash.slice(1)
  if (h === 'team' || h.startsWith('team-')) return { page: 'team', sub: h.slice(5) }
  if (h === 'awards' || h === 'alumni') return { page: h, sub: '' }
  return { page: 'home', sub: '' }
}

const PAGE_META = {
  alumni: {
    title: 'Alumni — Overdrive 17294',
    description: 'Former members of Overdrive, FTC Team 17294 from Frisco, Texas, and where they went next.',
  },
}
const DEFAULT_META = {}

export default function App() {
  const scroller = useRef(null)
  const [intro, setIntro] = useState(shouldIntro)
  const [route, setRoute] = useState(parseHash)
  const { page, sub } = route

  useEffect(() => {
    const fn = () => setRoute(parseHash())
    addEventListener('hashchange', fn)
    return () => removeEventListener('hashchange', fn)
  }, [])

  // Page change -> top; sub-section link -> smooth scroll to it. Always the panel's own scroll.
  useEffect(() => {
    const el = scroller.current
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = sub && document.getElementById(`team-${sub}`)
    // scroll-margin-top on the section clears both sticky bars
    if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    else el.scrollTo({ top: 0, behavior: 'auto' })
  }, [page, sub])

  // Per-page title and description; pages without an entry keep the defaults from index.html.
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]')
    DEFAULT_META.title ??= document.title
    DEFAULT_META.description ??= meta?.content
    const m = PAGE_META[page] || DEFAULT_META
    document.title = m.title
    meta?.setAttribute('content', m.description)
  }, [page])

  // Observe (never alter) native scrolling of the left panel.
  useEffect(() => {
    const el = scroller.current
    const sync = () => updateProgress(el)
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    const ro = new ResizeObserver(sync)
    ro.observe(el); ro.observe(el.firstElementChild)
    return () => { el.removeEventListener('scroll', sync); ro.disconnect() }
  }, [])

  const toTop = useCallback(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    scroller.current.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }, [])

  const done = useCallback(() => {
    try { sessionStorage.setItem('od-intro', '1') } catch {}
    setIntro(false)
    scroller.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className={`app${page !== 'home' ? ' app--wide' : ''}`}>
      <div className="left" ref={scroller} tabIndex={-1}>
        <div className="left__inner">
          <FolderNav page={page} onHome={toTop} />
          <main>
            {page === 'team' ? (
              <TeamPage />
            ) : page === 'awards' ? (
              <AwardsPage />
            ) : page === 'alumni' ? (
              <AlumniPage />
            ) : (
              <>
                <Hero ready={!intro} />
                <Identity />
                <Champions />
                <Sustainability />
                <Engineering />
              </>
            )}
          </main>
          <Footer />
        </div>
      </div>
      {/* The rotating logo belongs to the home page only: unmounting disposes its WebGL context. */}
      {page === 'home' && <LogoPanel />}
      {intro && <Intro onDone={done} />}
    </div>
  )
}
