import { TABS } from '../config.js'

export default function FolderNav({ page, onHome }) {
  return (
    <header className="nav">
      <nav aria-label="Primary">
        <ul className="tabs">
          {TABS.map((t, i) => {
            const active = t.id === page
            return (
              <li key={t.id} className={`tab${active ? ' is-active' : ''}${t.enabled ? '' : ' is-disabled'}`} style={{ '--i': TABS.length - i }}>
                {t.enabled ? (
                  <a
                    href={`#${t.id}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={(e) => { if (active && t.id === 'home') { e.preventDefault(); onHome() } }}
                  >
                    <span>{t.label}</span>
                  </a>
                ) : (
                  <span className="tab__off" aria-disabled="true" title="Coming soon"><span>{t.label}</span></span>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
