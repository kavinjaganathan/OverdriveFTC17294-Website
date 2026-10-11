import { CONTACT, TEAM } from '../config.js'

export function Hero({ ready }) {
  return (
    <section id="home" className={`hero ${ready ? 'is-ready' : ''}`} aria-label="Overdrive 17294">
      <div className="hero__inner reveal">
        <p className="eyebrow">FIRST Tech Challenge · Team 17294</p>
        <h1 className="hero__title">Overdrive</h1>
        <p className="hero__sub">FTC robotics · Frisco, Texas</p>
        <p className="hero__motto">Think. Build. Inspire.</p>
        <p className="hero__desc">{TEAM.description}</p>
      </div>
    </section>
  )
}

const FACTS = [
  ['FTC team number', '17294'],
  ['Established', 'Est. 2019'],
  ['Team experience', '7+ years'],
  ['Location', 'Frisco, Texas'],
]

export function Identity() {
  return (
    <section className="identity" aria-label="Team identity">
      <dl>
        {FACTS.map(([l, v]) => (
          <div key={l} className="fact">
            <dt>{l}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function Champions() {
  return (
    <section className="champs" aria-labelledby="champs-h">
      <div className="champs__text">
        <p className="eyebrow">State championship</p>
        <h2 id="champs-h" className="h2">UIL State Champions</h2>
        <p className="champs__meta">2023–2024 · FIRST Tech Challenge</p>
        <p className="lead">A season defined by engineering, teamwork, and determination.</p>
      </div>
      <figure className="champs__photo">
        <img
          src="/uil-state-champions-trophy.png"
          width="692"
          height="473"
          loading="lazy"
          decoding="async"
          alt="Overdrive FTC 17294's UIL State Championship trophy"
        />
      </figure>
    </section>
  )
}

const PRINCIPLES = [
  ['Reduce waste', 'Minimize unnecessary material waste throughout the design and prototyping process.'],
  ['Think resourcefully', 'Make thoughtful decisions about the materials, parts, and equipment we use.'],
  ['Inspire change', 'Encourage our team and community to think about a more sustainable future.'],
]

export function Sustainability() {
  return (
    <section className="green" aria-labelledby="green-h">
      <svg className="green__topo" viewBox="0 0 400 400" aria-hidden fill="none" stroke="currentColor" strokeWidth="1">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={i} d={`M${60 + i * 22} ${210 - i * 6} C${70 + i * 20} ${90 + i * 14}, ${200} ${50 + i * 18}, ${300 - i * 14} ${130 + i * 10} S${360 - i * 22} ${290 - i * 6}, ${250} ${330 - i * 14} S${70 + i * 16} ${320 - i * 12}, ${60 + i * 22} ${210 - i * 6}Z`} />
        ))}
      </svg>
      <p className="eyebrow">Engineering with purpose</p>
      <h2 id="green-h" className="h2">Innovation, with the planet in mind.</h2>
      <p className="lead">At Overdrive, engineering means more than building robots. We believe innovation should go hand in hand with environmental responsibility. By using resources thoughtfully, reducing unnecessary waste, and encouraging sustainable practices, we aim to make a positive impact beyond the competition field.</p>
      <dl className="green__list">
        {PRINCIPLES.map(([t, b]) => (
          <div key={t}>
            <dt>{t}</dt>
            <dd>{b}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function Engineering() {
  return (
    <section className="eng" aria-labelledby="eng-h">
      <p className="eyebrow">Engineering</p>
      <h2 id="eng-h" className="h2">Engineered to evolve.</h2>
      <p className="lead">{TEAM.engineering}</p>
    </section>
  )
}

const Icon = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" />
    </>
  ),
}

export function Footer() {
  return (
    <footer id="contact" className="foot">
      <div>
        <strong>Overdrive · FTC {TEAM.number}</strong>
        <p>{TEAM.location} · {TEAM.est}</p>
        <p>{TEAM.motto}</p>
      </div>
      <div className="foot__links">
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        {['instagram', 'youtube'].map((k) => (
          <a key={k} href={CONTACT[k].url} target="_blank" rel="noopener noreferrer" className="foot__social">
            <span className="foot__icon"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>{Icon[k]}</svg></span>
            {CONTACT[k].handle}
          </a>
        ))}
      </div>
    </footer>
  )
}
