import { lazy, Suspense, useEffect, useState } from 'react'
import ModelBoundary from '../model/ModelBoundary.jsx'

const ModelStage = lazy(() => import('../model/ModelStage.jsx'))

/** Fixed right panel (compact strip on mobile). Never scrolls; the left panel owns scrolling. */
export default function LogoPanel() {
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 900px)').matches)
  useEffect(() => {
    const mq = matchMedia('(max-width: 900px)')
    const fn = () => setMobile(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  return (
    <aside className="right" aria-label="Overdrive team logo, 3D model">
      <ModelBoundary>
        <Suspense fallback={null}><ModelStage mobile={mobile} /></Suspense>
      </ModelBoundary>
    </aside>
  )
}
