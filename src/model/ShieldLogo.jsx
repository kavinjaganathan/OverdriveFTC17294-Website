import { useEffect, useMemo } from 'react'
import { CanvasTexture, DoubleSide, ExtrudeGeometry, Shape, SRGBColorSpace } from 'three'
import { clipPolygon, rect, S, shapeFrom, shieldPoints, toModel } from './shieldGeometry.js'

/**
 * Procedural 3D reconstruction of the Overdrive shield (stripes, tilted OVERDRIVE
 * banner, gauge dial) from the pitch-deck artwork. Not a flat image: every layer is
 * extruded geometry with real thickness and side faces; the back side repeats the design.
 *
 * Approximations: proportions measured by eye from a 223x301 px raster; the banner
 * lettering is a canvas texture in the site font rather than the original hand-drawn type.
 * Contract for a replacement model (e.g. robot CAD): centred on the origin, roughly 2 x 2.6 units.
 */
const COLOR = { purple: '#8f3ba5', dark: '#2f2e29', cream: '#e0daca', ink: '#1b1618' }

const BASE_D = 0.26
const Z0 = BASE_D / 2

const extrude = (shape, depth, bevel = false) =>
  new ExtrudeGeometry(shape, { depth, bevelEnabled: bevel, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 3, curveSegments: 40 })

function useBannerTexture() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024; c.height = 192
    const t = new CanvasTexture(c)
    t.colorSpace = SRGBColorSpace
    t.anisotropy = 8
    t.userData.canvas = c
    return t
  }, [])
  useEffect(() => {
    let live = true
    const draw = () => {
      if (!live) return
      const c = tex.userData.canvas, g = c.getContext('2d')
      g.clearRect(0, 0, c.width, c.height)
      g.font = '900 150px Montserrat, Gotham, "Avenir Next", Arial, sans-serif'
      g.textAlign = 'center'; g.textBaseline = 'middle'
      g.lineJoin = 'round'; g.lineWidth = 10; g.strokeStyle = COLOR.ink; g.fillStyle = COLOR.purple
      g.strokeText('OVERDRIVE', c.width / 2, c.height / 2 + 6)
      g.fillText('OVERDRIVE', c.width / 2, c.height / 2 + 6)
      tex.needsUpdate = true
    }
    draw()
    document.fonts?.load('900 150px Montserrat').then(draw).catch(() => {})
    return () => { live = false }
  }, [tex])
  return tex
}

function Face({ banner }) {
  const geo = useMemo(() => {
    const outer = shieldPoints(0)
    const plate = shieldPoints(14)
    const field = shieldPoints(42)

    // 10 vertical stripes across the field; odd ones are cream, even ones are the dark field.
    const x0 = toModel([99, 0])[0], x1 = toModel([555, 0])[0]
    const w = (x1 - x0) / 10
    const cream = []
    for (let i = 1; i < 10; i += 2) {
      const poly = clipPolygon(rect(x0 + w * (i + 0.5), 0, w, 4), field)
      if (poly.length > 2) cream.push(extrude(shapeFrom(poly), 0.022))
    }

    // Banner tilted ~10deg, rising to the right (as in the artwork)
    const bc = toModel([327, 470])
    const ang = (10 * Math.PI) / 180
    const bannerOutline = clipPolygon(rect(bc[0], bc[1], 2.4, 100 * S + 0.05, ang), field)
    const bannerFill = clipPolygon(rect(bc[0], bc[1], 2.4, 100 * S, ang), field)

    const dc = toModel([326, 650])
    const disc = (r) => { const s = new Shape(); s.absarc(dc[0], dc[1], r, 0, Math.PI * 2, false); return s }

    const hubShape = new Shape(); hubShape.absarc(0, 0, 12 * S, 0, Math.PI * 2, false)
    return {
      base: extrude(shapeFrom(outer), BASE_D, true),
      plate: extrude(shapeFrom(plate), 0.03),
      field: extrude(shapeFrom(field), 0.03),
      cream,
      bannerOutline: extrude(shapeFrom(bannerOutline), 0.022),
      bannerFill: extrude(shapeFrom(bannerFill), 0.022),
      dialOutline: extrude(disc(104 * S), 0.022),
      dialFill: extrude(disc(94 * S), 0.026),
      hub: extrude(hubShape, 0.03),
      dc, bc, ang,
    }
  }, [])

  // z of each layer's bottom surface, stacked above the base slab
  const zPlate = Z0, zField = zPlate + 0.03, zCream = zField + 0.03
  const zBanOut = zCream + 0.022, zBan = zBanOut + 0.022, zText = zBan + 0.024
  const zDialO = zCream + 0.011, zDial = zDialO + 0.022
  const needleLen = 88 * S
  const needleAng = Math.atan2(72, 46)

  return (
    <group>
      <mesh geometry={geo.plate} position-z={zPlate}><meshPhysicalMaterial color={COLOR.purple} roughness={0.35} clearcoat={0.7} clearcoatRoughness={0.3} /></mesh>
      <mesh geometry={geo.field} position-z={zField}><meshStandardMaterial color={COLOR.dark} roughness={0.55} /></mesh>
      {geo.cream.map((g, i) => <mesh key={i} geometry={g} position-z={zCream}><meshStandardMaterial color={COLOR.cream} roughness={0.6} /></mesh>)}
      <mesh geometry={geo.bannerOutline} position-z={zBanOut}><meshStandardMaterial color={COLOR.ink} roughness={0.5} /></mesh>
      <mesh geometry={geo.bannerFill} position-z={zBan}><meshPhysicalMaterial color={COLOR.purple} roughness={0.35} clearcoat={0.7} clearcoatRoughness={0.3} /></mesh>
      {banner && (
        <mesh position={[geo.bc[0], geo.bc[1], zText]} rotation-z={geo.ang}>
          <planeGeometry args={[1.62, 1.62 * (192 / 1024)]} />
          <meshBasicMaterial map={banner} transparent side={DoubleSide} toneMapped={false} />
        </mesh>
      )}
      <mesh geometry={geo.dialOutline} position-z={zDialO}><meshStandardMaterial color={COLOR.ink} roughness={0.5} /></mesh>
      <mesh geometry={geo.dialFill} position-z={zDial}><meshPhysicalMaterial color={COLOR.purple} roughness={0.3} clearcoat={0.9} clearcoatRoughness={0.2} /></mesh>
      <group position={[geo.dc[0], geo.dc[1], zDial + 0.026]}>
        <mesh position={[(Math.cos(needleAng) * needleLen) / 2, (Math.sin(needleAng) * needleLen) / 2, 0.008]} rotation-z={needleAng}>
          <boxGeometry args={[needleLen, 0.022, 0.016]} />
          <meshStandardMaterial color={COLOR.ink} roughness={0.4} />
        </mesh>
        <mesh geometry={geo.hub} position-z={-0.004}><meshStandardMaterial color={COLOR.ink} roughness={0.4} /></mesh>
      </group>
      <mesh geometry={geo.base} position-z={-Z0}><meshStandardMaterial color={COLOR.ink} roughness={0.45} metalness={0.1} /></mesh>
    </group>
  )
}

export default function ShieldLogo() {
  const banner = useBannerTexture()
  return (
    <group>
      <Face banner={banner} />
      <group rotation-y={Math.PI}><Face banner={banner} /></group>
    </group>
  )
}
