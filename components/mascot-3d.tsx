'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SKIN = '#58a4e4'
const SKIN_DARK = '#2f78c2'
const SHIRT = '#14285e'
const GLASSES = '#1f52d6'
const IRIS = '#0b1a3d'

function skinTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = SKIN
  ctx.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 4 + Math.random() * 10
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(30,90,170,.12)' : 'rgba(200,232,255,.1)'
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return texture
}

function textTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  draw(canvas.getContext('2d')!)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function shadowTexture() {
  return textTexture(256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(0,80,245,.55)'); g.addColorStop(0.45, 'rgba(0,40,140,.28)'); g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256)
  })
}

// Capsule stretched between two points.
function limb(a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a)
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, Math.max(dir.length() - radius, 0.01), 8, 16), material)
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
  return mesh
}

// Tube whose radius shrinks along the curve, for the tail.
function taperedTube(curve: THREE.Curve<THREE.Vector3>, segments: number, radial: number, r0: number, r1: number) {
  const frames = curve.computeFrenetFrames(segments, false)
  const positions: number[] = [], normals: number[] = [], uvs: number[] = [], indices: number[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments, p = curve.getPointAt(t), r = THREE.MathUtils.lerp(r0, r1, Math.pow(t, 0.8))
    for (let j = 0; j <= radial; j++) {
      const v = (j / radial) * Math.PI * 2
      const n = new THREE.Vector3().addScaledVector(frames.normals[i], Math.cos(v)).addScaledVector(frames.binormals[i], Math.sin(v)).normalize()
      positions.push(p.x + n.x * r, p.y + n.y * r, p.z + n.z * r)
      normals.push(n.x, n.y, n.z)
      uvs.push(t * 6, j / radial)
    }
  }
  for (let i = 0; i < segments; i++) for (let j = 0; j < radial; j++) {
    const a = i * (radial + 1) + j, b = a + radial + 1
    indices.push(a, b, a + 1, b, b + 1, a + 1)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  return geometry
}

function buildMascot() {
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
  const skinMap = skinTexture()
  const skin = new THREE.MeshPhysicalMaterial({ color: '#ffffff', map: skinMap, bumpMap: skinMap, bumpScale: 0.12, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.5 })
  const skinDark = new THREE.MeshStandardMaterial({ color: SKIN_DARK, roughness: 0.55 })
  const shirt = new THREE.MeshStandardMaterial({ color: SHIRT, roughness: 0.85 })
  const shirtLight = new THREE.MeshStandardMaterial({ color: '#1c3576', roughness: 0.85 })
  const white = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.25 })
  const iris = new THREE.MeshStandardMaterial({ color: IRIS, roughness: 0.2 })
  const black = new THREE.MeshStandardMaterial({ color: '#02060f', roughness: 0.15 })
  const glasses = new THREE.MeshPhysicalMaterial({ color: GLASSES, roughness: 0.25, clearcoat: 1 })
  const lens = new THREE.MeshPhysicalMaterial({ color: '#dbe8ff', roughness: 0.05, transmission: 0.9, transparent: true, opacity: 0.18, thickness: 0.02 })
  const blue = new THREE.MeshStandardMaterial({ color: '#0050F5', roughness: 0.5 })

  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)

  // Legs and feet
  for (const side of [-1, 1]) {
    const hip = v(0.24 * side, 0.95, 0), knee = v(0.32 * side, 0.52, 0.08), ankle = v(0.34 * side, 0.14, 0.04)
    body.add(limb(hip, knee, 0.13, skin), limb(knee, ankle, 0.11, skin))
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), skin)
    foot.scale.set(1.1, 0.45, 1.3); foot.position.set(0.36 * side, 0.07, 0.14)
    body.add(foot)
    for (const spread of [-0.5, 0, 0.5]) {
      const angle = spread + side * 0.25
      body.add(limb(v(0.36 * side, 0.06, 0.2), v(0.36 * side + Math.sin(angle) * 0.24, 0.05, 0.2 + Math.cos(angle) * 0.22), 0.04, skin))
    }
  }

  // Shirt
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 0.7, 12, 32), shirt)
  torso.scale.set(1.08, 1, 0.8); torso.position.y = 1.52
  body.add(torso)
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.055, 12, 32), shirtLight)
  collar.rotation.x = Math.PI / 2 - 0.25; collar.position.set(0, 2.2, 0.04)
  body.add(collar)
  const placket = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.32, 0.02), shirtLight)
  placket.position.set(0, 2.0, 0.39); placket.rotation.x = -0.28
  body.add(placket)

  const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.1), new THREE.MeshBasicMaterial({ transparent: true, map: textTexture(340, 100, (ctx) => {
    ctx.font = '800 62px Montserrat, Arial, sans-serif'; ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.fillText('ANVITI', 6, 46)
    const w = ctx.measureText('ANVITI').width; ctx.fillStyle = '#3b7bff'; ctx.beginPath(); ctx.arc(w + 18, 66, 9, 0, Math.PI * 2); ctx.fill()
  }) }))
  logo.position.set(0.24, 1.98, 0.36); logo.rotation.set(-0.2, 0.42, 0)
  body.add(logo)

  // Lanyard and badge
  const badgeTop = v(-0.06, 1.66, 0.43)
  for (const side of [-1, 1]) {
    const strap = new THREE.CatmullRomCurve3([v(0.19 * side, 2.2, 0.16), v(0.13 * side - 0.03, 1.95, 0.4), badgeTop.clone().add(v(0.02 * side, 0, 0))])
    body.add(new THREE.Mesh(new THREE.TubeGeometry(strap, 20, 0.014, 6), blue))
  }
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.015), [white, white, white, white, new THREE.MeshStandardMaterial({ roughness: 0.3, map: textTexture(200, 260, (ctx) => {
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 200, 260); ctx.fillStyle = '#0050F5'; ctx.fillRect(0, 0, 200, 34)
    ctx.font = '900 120px Montserrat, Arial, sans-serif'; ctx.fillStyle = '#061536'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('A', 92, 156)
    ctx.fillStyle = '#0050F5'; ctx.beginPath(); ctx.arc(152, 192, 13, 0, Math.PI * 2); ctx.fill()
  }) }), white])
  badge.position.set(-0.06, 1.52, 0.44); badge.rotation.x = -0.08
  body.add(badge)

  // Arms: the left one hangs, the right one waves.
  const shoulderL = v(0.56, 2.02, 0), elbowL = v(0.76, 1.5, 0.06), wristL = v(0.74, 1.02, 0.16)
  const sleeveL = limb(shoulderL, v(0.66, 1.78, 0.02), 0.19, shirt)
  body.add(sleeveL, limb(shoulderL, elbowL, 0.1, skin), limb(elbowL, wristL, 0.09, skin))
  const watch = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.03, 8, 24), black)
  watch.position.set(0.745, 1.12, 0.14); watch.rotation.x = Math.PI / 2
  body.add(watch)
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), skin)
  handL.position.copy(wristL).add(v(0, -0.06, 0.02)); handL.scale.set(0.9, 1.1, 0.7)
  body.add(handL)
  for (const f of [-1, 0, 1]) body.add(limb(v(0.74 + f * 0.05, 0.96, 0.18), v(0.74 + f * 0.08, 0.78, 0.22), 0.032, skin))

  const shoulderR = v(-0.56, 2.02, 0), elbowR = v(-0.98, 1.78, 0.12)
  body.add(limb(shoulderR, v(-0.7, 1.9, 0.04), 0.19, shirt), limb(shoulderR, elbowR, 0.1, skin))
  const forearm = new THREE.Group()
  forearm.position.copy(elbowR)
  forearm.add(limb(v(0, 0, 0), v(-0.1, 0.55, 0.06), 0.09, skin))
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), skin)
  palm.position.set(-0.11, 0.68, 0.07); palm.scale.set(1, 1.05, 0.55)
  forearm.add(palm)
  for (const [dx, len] of [[-0.12, 0.2], [-0.04, 0.26], [0.04, 0.25], [0.11, 0.19]]) {
    const base = v(-0.11 + dx * 0.9, 0.76, 0.07)
    forearm.add(limb(base, base.clone().add(v(dx * 0.9, len, 0.02)), 0.036, skin))
  }
  forearm.add(limb(v(-0.2, 0.62, 0.08), v(-0.34, 0.74, 0.1), 0.036, skin))
  body.add(forearm)

  // Neck and head
  body.add(limb(v(0, 2.1, 0), v(0, 2.5, 0.04), 0.2, skin))
  const head = new THREE.Group()
  head.position.set(0, 2.9, 0.05)
  head.scale.setScalar(1.18)
  body.add(head)
  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.58, 40, 32), skin)
  cranium.scale.set(1, 0.92, 0.95)
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.43, 32, 24), skin)
  snout.position.set(0, -0.16, 0.36); snout.scale.set(1.02, 0.78, 0.95)
  const casque = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), skin)
  casque.position.set(0, 0.36, -0.14); casque.scale.set(0.34, 0.8, 0.95); casque.rotation.x = -0.35
  head.add(cranium, snout, casque)
  for (let i = 0; i < 5; i++) {
    const a = -0.2 + i * 0.32
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.11, 10), skinDark)
    spike.position.set(0, 0.36 + Math.cos(a) * 0.36, -0.14 - Math.sin(a) * 0.4); spike.rotation.x = -a
    head.add(spike)
  }
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.017, 8, 40, Math.PI * 0.72), black)
  mouth.position.set(0, -0.12, 0.62); mouth.rotation.set(-0.35, 0, Math.PI + Math.PI * 0.14)
  head.add(mouth)

  const pupils: THREE.Group[] = []
  const eyes: THREE.Group[] = []
  for (const side of [-1, 1]) {
    const center = v(0.25 * side, 0.1, 0.46)
    const turret = new THREE.Mesh(new THREE.SphereGeometry(0.25, 28, 20), skin)
    turret.position.copy(center)
    head.add(turret)
    const eye = new THREE.Group()
    eye.position.copy(center).add(v(0, 0, 0.08))
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 24), white)
    const look = new THREE.Group()
    const irisMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), iris)
    irisMesh.position.z = 0.135; irisMesh.scale.z = 0.6
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), black)
    pupil.position.z = 0.19; pupil.scale.z = 0.5
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' }))
    shine.position.set(0.035, 0.04, 0.205)
    look.add(irisMesh, pupil, shine)
    eye.add(sclera, look)
    head.add(eye)
    eyes.push(eye); pupils.push(look)

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.032, 14, 48), glasses)
    rim.position.set(0.25 * side, 0.1, 0.78)
    const glass = new THREE.Mesh(new THREE.CircleGeometry(0.21, 40), lens)
    glass.position.copy(rim.position)
    head.add(rim, glass)
    head.add(limb(v(0.46 * side, 0.12, 0.74), v(0.6 * side, 0.14, 0.05), 0.022, glasses))
  }
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.025, 10, 20, Math.PI), glasses)
  bridge.position.set(0, 0.13, 0.8)
  head.add(bridge)

  // Tail: leaves the back, then curls into a spiral beside the right leg.
  const points = [v(0.18, 0.95, -0.3), v(0.5, 0.66, -0.42), v(0.86, 0.36, -0.4)]
  const center = v(1.22, 0.72, -0.34), turns = 1.7, steps = 60
  for (let k = 1; k <= steps; k++) {
    const t = k / steps, r = 0.48 * (1 - t * 0.88), a = -Math.PI * 0.62 + t * turns * Math.PI * 2
    points.push(v(center.x + Math.cos(a) * r, center.y + Math.sin(a) * r, center.z + t * 0.06))
  }
  const tail = new THREE.Mesh(taperedTube(new THREE.CatmullRomCurve3(points), 220, 18, 0.15, 0.028), skin)
  body.add(tail)

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0.3, 0.005, 0)
  root.add(shadow)

  return { root, body, head, forearm, eyes, pupils, torso }
}

export default function Mascot3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    camera.position.set(0, 2.0, 9.6)
    camera.lookAt(0.15, 1.62, 0)

    scene.add(new THREE.HemisphereLight('#d6e4ff', '#0a1636', 1.4))
    const key = new THREE.DirectionalLight('#ffffff', 2.4)
    key.position.set(3, 5, 5)
    const rim = new THREE.DirectionalLight('#3d86ff', 3.2)
    rim.position.set(-4, 3, -4)
    const fill = new THREE.PointLight('#6ea8ff', 6, 12)
    fill.position.set(-2.5, 1.5, 3)
    scene.add(key, rim, fill)

    const mascot = buildMascot()
    scene.add(mascot.root)

    const pointer = new THREE.Vector2()
    let drag: { x: number; spin: number } | null = null
    let spin = 0
    const onPointerMove = (e: PointerEvent) => {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
      if (drag) spin = drag.spin + ((e.clientX - drag.x) / mount.clientWidth) * Math.PI * 2
    }
    const onPointerDown = (e: PointerEvent) => { drag = { x: e.clientX, spin }; mount.setPointerCapture(e.pointerId) }
    const onPointerUp = () => { drag = null }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    mount.addEventListener('pointerdown', onPointerDown)
    mount.addEventListener('pointerup', onPointerUp)
    mount.addEventListener('pointercancel', onPointerUp)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    let visible = true
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    visibility.observe(mount)

    const clock = new THREE.Clock()
    let frame = 0, nextBlink = 2.5
    const damp = (current: number, target: number, lambda: number, dt: number) => THREE.MathUtils.damp(current, target, lambda, dt)
    const animate = () => {
      frame = requestAnimationFrame(animate)
      if (!visible) return
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime
      if (!drag) spin = damp(spin, 0, 2.5, dt)
      const { root, body, head, forearm, eyes, pupils, torso } = mascot
      root.rotation.y = damp(root.rotation.y, -0.18 + pointer.x * 0.35 + spin, 5, dt)
      head.rotation.y = damp(head.rotation.y, pointer.x * 0.35, 6, dt)
      head.rotation.x = damp(head.rotation.x, -pointer.y * 0.18, 6, dt)
      for (const look of pupils) {
        look.rotation.y = damp(look.rotation.y, pointer.x * 0.45, 10, dt)
        look.rotation.x = damp(look.rotation.x, -pointer.y * 0.35, 10, dt)
      }
      if (!reducedMotion) {
        body.position.y = Math.sin(t * 1.8) * 0.025
        torso.scale.x = 1.08 + Math.sin(t * 1.8) * 0.012
        forearm.rotation.z = Math.sin(t * 5.5) * 0.28 - 0.05
        head.rotation.z = Math.sin(t * 1.2) * 0.04
        if (t > nextBlink) nextBlink = t + 2.5 + Math.random() * 3
        const blink = nextBlink - t < 0.14 ? 0.12 : 1
        for (const eye of eyes) eye.scale.y = damp(eye.scale.y, blink, 30, dt)
      }
      renderer.render(scene, camera)
    }
    animate()
    requestAnimationFrame(() => mount.classList.add('is-ready'))

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibility.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      mount.removeEventListener('pointerdown', onPointerDown)
      mount.removeEventListener('pointerup', onPointerUp)
      mount.removeEventListener('pointercancel', onPointerUp)
      scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return
        obj.geometry.dispose()
        for (const material of [obj.material].flat()) {
          for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose()
          material.dispose()
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mountRef} className="mascot-3d" role="img" aria-label="Mascote da Anviti: um camaleão azul de óculos acenando" />
}
