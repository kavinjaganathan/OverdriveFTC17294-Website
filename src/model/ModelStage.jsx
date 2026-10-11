import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { MathUtils } from 'three'
import { scrollProgress, subscribeProgress } from '../scrollStore.js'
import { TeamModel } from './index.js'

/**
 * Camera, lights, shadow and scroll-linked rotation. Rotation is a pure function of the
 * left panel's normalised scroll progress (read per frame; no React state, no listeners here).
 */
const TURNS = 1.5 // revolutions across the full scroll range

function ScrollRotor({ children }) {
  const group = useRef()
  const aspect = useThree((s) => s.size.width / s.size.height)
  const fit = Math.min(1, aspect / 0.7)
  const invalidate = useThree((s) => s.invalidate)
  // frameloop="demand": render only on scroll / resize and while the rotation is still settling
  useEffect(() => subscribeProgress(invalidate), [invalidate])
  useFrame((_, dt) => {
    const target = scrollProgress.current * Math.PI * 2 * TURNS
    const g = group.current
    g.rotation.y = MathUtils.damp(g.rotation.y, target, 12, dt)
    if (Math.abs(target - g.rotation.y) > 0.0005) invalidate()
  })
  return <group scale={fit}><group ref={group} rotation-x={0.06}>{children}</group></group>
}

export default function ModelStage({ mobile }) {
  return (
    <Canvas
      frameloop="demand"
      shadows={!mobile}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 7.2], fov: 30 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
    >
      <hemisphereLight args={['#ffffff', '#e8d9f0', 1.25]} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} castShadow={!mobile} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 1, -4]} intensity={1.6} color="#d8b4e8" />
      <directionalLight position={[0, -2, 4]} intensity={0.5} />
      <ScrollRotor><TeamModel /></ScrollRotor>
      {!mobile && <ContactShadows position={[0, -1.7, 0]} opacity={0.35} scale={7} blur={2.8} far={3} color="#6d2a80" />}
    </Canvas>
  )
}
