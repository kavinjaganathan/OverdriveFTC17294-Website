// Large numerals with small uppercase labels, separated by hairlines. `items`: [{ label, value }].
export default function StatsStrip({ items, className = '' }) {
  return (
    <dl className={`stats ${className}`.trim()}>
      {items.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
    </dl>
  )
}
