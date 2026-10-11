import { useState } from 'react'
import { LEADERS, SUBTEAMS } from '../data/team.js'

const INTRO = 'Behind every robot is a team of people bringing different skills and ideas together. Get to know the students who design, build, program, and share what we do at Overdrive.'

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

function MemberCard({ member, specialty, leader }) {
  const meta = [member.grade, member.school].filter(Boolean).join(' · ')
  return (
    <article className={`member${leader ? ' member--leader' : ''}`}>
      <Portrait member={member} />
      <div className="member__body">
        <p className="member__title">{member.title}</p>
        <h3 className="member__name">{member.name}</h3>
        <p className="member__meta">{meta}</p>
        <p className="member__meta">{member.year} year on the team</p>
        <p className="member__desc">{member.description}</p>
        <dl className="member__facts">
          <div><dt>Specialty</dt><dd>{member.specialty || specialty}</dd></div>
          {member.hobbies && <div><dt>Hobbies</dt><dd>{member.hobbies}</dd></div>}
        </dl>
      </div>
    </article>
  )
}

export default function TeamPage() {
  return (
    <div className="team">
      <header className="team__head wrap">
        <h1 className="team__title">Meet the Team</h1>
        <div className="team__intro">
          <p className="lead">{INTRO}</p>
          <nav className="jump" aria-label="Jump to a subteam">
            {SUBTEAMS.map((s) => (
              <a key={s.id} href={`#team-${s.id}`} className={`jump__link jump--${s.id}`}>{s.title}</a>
            ))}
          </nav>
        </div>
      </header>

      <section id="team-leadership" className="leaders wrap" aria-labelledby="leaders-h">
        <h2 id="leaders-h" className="team__label">Leadership</h2>
        <div className="leaders__grid">
          {LEADERS.map((m) => <MemberCard key={m.id} member={m} leader />)}
        </div>
      </section>

      {SUBTEAMS.map((s) => (
        <section key={s.id} id={`team-${s.id}`} className={`sub sub--${s.id}`} aria-labelledby={`${s.id}-h`}>
          <div className="wrap">
          <h2 id={`${s.id}-h`} className="sub__title">{s.title}</h2>
          <div className={`sub__grid${s.members.length === 4 ? ' sub__grid--four' : ''}`}>
            {s.members.map((m) => <MemberCard key={m.id} member={m} specialty={s.title} />)}
          </div>
          </div>
        </section>
      ))}
    </div>
  )
}
