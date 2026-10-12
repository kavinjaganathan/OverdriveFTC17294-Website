// Years on the team as four small squares plus a "Year N" label. Shared by the Team and Alumni pages;
// colours follow the nearest --c (subteam colour), falling back to the site purple.
export default function YearBar({ n, max = 4 }) {
  return (
    <span className="yearbar">
      <span className="yearbar__pips" aria-hidden>
        {Array.from({ length: max }, (_, i) => <i key={i} className={i < n ? 'on' : ''} />)}
      </span>
      Year {n}<span className="sr-only"> on the team</span>
    </span>
  )
}
