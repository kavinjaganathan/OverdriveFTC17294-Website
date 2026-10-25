import { useEffect, useRef } from 'react'
import { TABS } from '../config.js'

export default function FolderNav({ page, onHome }) {
  const list = useRef(null)
  // On narrow screens the tab row scrolls sideways: bring the current tab into view.
  useEffect(() => {
    const ul = list.current
    const li = ul.querySelector('.is-active')
    if (li && ul.scrollWidth > ul.clientWidth) ul.scrollLeft = li.offsetLeft - 16
  }, [page])
  return (
    <header className="nav">
      <nav aria-label="Primary">
        <ul className="tabs" ref={list}>
          {TABS.map((t, i) => {
            const active = t.id === page
            return (
              <li key={t.id} className={`tab${active ? ' is-active' : ''}${t.enabled ? '' : ' is-disabled'}`} style={{ '--i': TABS.length - i }}>
                {t.enabled ? (
                  <a
                    href={t.href ?? `#${t.id}`}
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
