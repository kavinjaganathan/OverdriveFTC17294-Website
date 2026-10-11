import { Shape } from 'three'

/**
 * Geometry helpers for the Overdrive shield, measured from the logo in the
 * pitch deck (reference crop: public/logo-reference.png, 669x903 px).
 * Logo-space (px, y down) -> model space (units, y up) via S / CX / CY.
 */
export const S = 1 / 300
const CX = 327
const CY = 455
export const toModel = ([x, y]) => [(x - CX) * S, (CY - y) * S]

const HALF_W = 270
const HALF_H = 390

function bez(p0, p1, p2, p3, n = 20) {
  const out = []
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ])
  }
  return out
}

/** Shield outline in logo px, shrunk by `inset` px on every side. Counter-clockwise in model space. */
export function shieldPoints(inset = 0) {
  const sx = (HALF_W - inset) / HALF_W
  const sy = (HALF_H - inset) / HALF_H
  const raw = [
    [327, 65], [62, 130], [58, 560],
    ...bez([58, 560], [58, 700], [185, 800], [327, 845]),
    ...bez([327, 845], [470, 800], [598, 700], [598, 560]),
    [592, 130],
  ]
  return raw.map(([x, y]) => toModel([CX + (x - CX) * sx, CY + (y - CY) * sy]))
}

export const shapeFrom = (pts) => {
  const s = new Shape()
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)))
  s.closePath()
  return s
}

/** Sutherland–Hodgman: clip polygon `subject` to the CONVEX polygon `clip` (both CCW). */
export function clipPolygon(subject, clip) {
  let out = subject
  for (let i = 0; i < clip.length && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length]
    const inside = (p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0
    const cross = (p, q) => {
      const dx = q[0] - p[0], dy = q[1] - p[1], ex = b[0] - a[0], ey = b[1] - a[1]
      const t = (ey * (a[0] - p[0]) - ex * (a[1] - p[1])) / (ey * dx - ex * dy)
      return [p[0] + dx * t, p[1] + dy * t]
    }
    const input = out
    out = []
    input.forEach((p, j) => {
      const q = input[(j + 1) % input.length]
      if (inside(p)) { out.push(p); if (!inside(q)) out.push(cross(p, q)) }
      else if (inside(q)) out.push(cross(p, q))
    })
  }
  return out
}

/** Rectangle (model units) centred at (cx,cy) rotated by `angle` radians, as a CCW polygon. */
export function rect(cx, cy, w, h, angle = 0) {
  const c = Math.cos(angle), s = Math.sin(angle)
  return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c])
}
