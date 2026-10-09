'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SKIN = '#6c9fd0'
const SHIRT = '#1b2c5c'
const SHIRT_DARK = '#142349'
const GLASSES = '#2a4b9e'
const IRIS = '#13295c'
const INK = '#0d1a33'

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void, repeat = false) {
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  draw(canvas.getContext('2d')!)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  if (repeat) texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return texture
}

// Small rounded scales with darker blotches, like the mascot's skin.
function drawScales(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = SKIN
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * size, y = Math.random() * size, r = 18 + Math.random() * 40
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(40,85,150,.35)'); g.addColorStop(1, 'rgba(40,85,150,0)')
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  const step = 20
  for (let row = 0; row * step * 0.86 < size + step; row++) {
    for (let col = 0; col * step < size + step; col++) {
      const x = col * step + (row % 2 ? step / 2 : 0), y = row * step * 0.86
      const g = ctx.createRadialGradient(x - 1.5, y - 1.5, 0.5, x, y, step * 0.62)
      g.addColorStop(0, 'rgba(220,238,255,.18)'); g.addColorStop(0.7, 'rgba(160,200,240,.03)'); g.addColorStop(1, 'rgba(25,60,115,.22)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(x, y, step * 0.6, 0, Math.PI * 2); ctx.fill()
    }
  }
}

// Capsule stretched between two points.
function limb(a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a)
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, Math.max(dir.length() - radius, 0.01), 8, 16), material)
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
  return mesh
}

// Truncated cone between two points (sleeves).
function segment(a: THREE.Vector3, b: THREE.Vector3, ra: number, rb: number, material: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a)
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rb, ra, dir.length(), 28, 1), material)
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
  return mesh
}

function ellipsoid(radii: [number, number, number], position: [number, number, number], material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), material)
  mesh.scale.set(...radii); mesh.position.set(...position)
  return mesh
}

// Tube whose radius shrinks along the curve, for the tail.
function taperedTube(curve: THREE.Curve<THREE.Vector3>, segments: number, radial: number, r0: number, r1: number) {
  const frames = curve.computeFrenetFrames(segments, false)
  const positions: number[] = [], normals: number[] = [], uvs: number[] = [], indices: number[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments, p = curve.getPointAt(t), r = THREE.MathUtils.lerp(r0, r1, Math.pow(t, 0.75))
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2
      const n = new THREE.Vector3().addScaledVector(frames.normals[i], Math.cos(a)).addScaledVector(frames.binormals[i], Math.sin(a)).normalize()
      positions.push(p.x + n.x * r, p.y + n.y * r, p.z + n.z * r)
      normals.push(n.x, n.y, n.z)
      uvs.push(t * 9, j / radial)
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

// Rounded-rectangle glasses frame with the lens hole cut out.
function frameGeometry(w: number, h: number, r: number, border: number) {
  const rounded = (path: THREE.Shape | THREE.Path, w: number, h: number, r: number) => {
    path.moveTo(-w / 2 + r, -h / 2)
    path.lineTo(w / 2 - r, -h / 2); path.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
    path.lineTo(w / 2, h / 2 - r); path.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
    path.lineTo(-w / 2 + r, h / 2); path.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
    path.lineTo(-w / 2, -h / 2 + r); path.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)
    return path
  }
  const shape = rounded(new THREE.Shape(), w, h, r) as THREE.Shape
  shape.holes.push(rounded(new THREE.Path(), w - border * 2, h - border * 2, Math.max(r - border, 0.02)) as THREE.Path)
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 3, curveSegments: 10 })
  geometry.translate(0, 0, -0.0175)
  return geometry
}

function buildMascot() {
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

  const skinMap = canvasTexture(512, 512, (ctx) => drawScales(ctx, 512), true)
  skinMap.repeat.set(2, 2)
  const tailMap = canvasTexture(512, 256, (ctx) => {
    drawScales(ctx, 512)
    ctx.fillStyle = 'rgba(30,70,135,.42)'; ctx.fillRect(0, 0, 150, 256)
    ctx.fillStyle = 'rgba(30,70,135,.2)'; ctx.fillRect(150, 0, 40, 256)
  }, true)
  const skin = new THREE.MeshPhysicalMaterial({ color: '#ffffff', map: skinMap, bumpMap: skinMap, bumpScale: 0.35, roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.6 })
  const tailSkin = new THREE.MeshPhysicalMaterial({ color: '#ffffff', map: tailMap, bumpMap: tailMap, bumpScale: 0.35, roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.6 })
  const shirt = new THREE.MeshStandardMaterial({ color: SHIRT, roughness: 0.9 })
  const shirtDark = new THREE.MeshStandardMaterial({ color: SHIRT_DARK, roughness: 0.9 })
  const white = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.25 })
  const iris = new THREE.MeshPhysicalMaterial({ color: IRIS, roughness: 0.15, clearcoat: 1 })
  const ink = new THREE.MeshStandardMaterial({ color: INK, roughness: 0.3 })
  const glasses = new THREE.MeshPhysicalMaterial({ color: GLASSES, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 })
  const lens = new THREE.MeshPhysicalMaterial({ color: '#e4eeff', roughness: 0.05, transparent: true, opacity: 0.14, depthWrite: false })
  const strap = new THREE.MeshStandardMaterial({ color: '#2f64d8', roughness: 0.6 })

  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)

  // Legs with chameleon feet (toes grouped in two bundles).
  for (const side of [-1, 1]) {
    const hip = v(0.19 * side, 1.02, 0), knee = v(0.31 * side, 0.57, 0.12), ankle = v(0.36 * side, 0.15, 0.03)
    body.add(limb(hip, knee, 0.115, skin), limb(knee, ankle, 0.09, skin))
    body.add(ellipsoid([0.1, 0.08, 0.11], [0.36 * side, 0.09, 0.02], skin))
    for (const [angle, length] of [[0.55, 0.3], [-0.45, 0.27]]) {
      const a = angle + side * 0.35, start = v(0.36 * side, 0.055, 0.06)
      const end = start.clone().add(v(Math.sin(a) * length, 0, Math.cos(a) * length))
      const toe = limb(start, end, 0.058, skin)
      toe.scale.set(1.25, 1, 0.75)
      body.add(toe)
      for (const spread of [-1, 0, 1]) {
        const tip = ellipsoid([0.035, 0.03, 0.035], [0, 0, 0], skin)
        const sideways = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a)).multiplyScalar(spread * 0.045)
        tip.position.copy(end).add(sideways).add(v(Math.sin(a) * 0.035, -0.012, Math.cos(a) * 0.035))
        body.add(tip)
      }
    }
  }

  // Polo shirt
  const profile = [v(0.001, 0.98, 0), v(0.41, 0.98, 0), v(0.43, 1.02, 0), v(0.41, 1.3, 0), v(0.44, 1.62, 0), v(0.49, 1.88, 0), v(0.47, 2.02, 0), v(0.36, 2.13, 0), v(0.2, 2.19, 0), v(0.001, 2.2, 0)]
  const torso = new THREE.Mesh(new THREE.LatheGeometry(profile.map((p) => new THREE.Vector2(p.x, p.y)), 48), shirt)
  torso.scale.z = 0.7
  body.add(torso)
  const hem = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.022, 8, 48), shirtDark)
  hem.rotation.x = Math.PI / 2; hem.position.y = 1.0; hem.scale.y = 0.7
  body.add(hem)
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.045, 12, 40), shirtDark)
  collar.rotation.x = Math.PI / 2 - 0.3; collar.position.set(0, 2.18, 0.03); collar.scale.y = 0.85
  body.add(collar)
  for (const side of [-1, 1]) {
    const flap = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.11, 0.025), shirtDark)
    flap.position.set(0.085 * side, 2.1, 0.25); flap.rotation.set(-0.55, -0.35 * side, -0.55 * side)
    body.add(flap)
  }
  const placket = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.26, 0.02), shirtDark)
  placket.position.set(0, 1.94, 0.31); placket.rotation.x = -0.18
  body.add(placket)
  for (const y of [2.0, 1.89]) body.add(ellipsoid([0.014, 0.014, 0.008], [0, y, 0.325 - (2.0 - y) * 0.18], white))

  const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.11), new THREE.MeshBasicMaterial({ transparent: true, map: canvasTexture(300, 110, (ctx) => {
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic'
    ctx.font = '800 58px Montserrat, Arial, sans-serif'; ctx.fillText('ANVITI', 10, 62)
    const w = ctx.measureText('ANVITI').width
    ctx.fillStyle = '#4a86ff'; ctx.beginPath(); ctx.arc(w + 22, 56, 7, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#c9d6ee'; ctx.font = '600 17px Arial, sans-serif'
    ctx.letterSpacing = '6px'; ctx.fillText('TECNOLOGIA', 22, 94)
  }) }))
  logo.position.set(0.22, 1.84, 0.318); logo.rotation.set(-0.06, 0.36, 0)
  body.add(logo)

  // Lanyard and badge
  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([v(0.16 * side, 2.17, 0.17), v(0.1 * side, 1.95, 0.315), v(0.03 * side, 1.67, 0.33)])
    body.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.012, 6), strap))
  }
  body.add(ellipsoid([0.025, 0.02, 0.012], [0, 1.66, 0.335], new THREE.MeshStandardMaterial({ color: '#9fb0c8', metalness: 0.8, roughness: 0.3 })))
  const badgeFace = new THREE.MeshStandardMaterial({ roughness: 0.35, map: canvasTexture(180, 230, (ctx) => {
    ctx.fillStyle = '#f4f7fb'; ctx.fillRect(0, 0, 180, 230)
    ctx.strokeStyle = '#c7d0dd'; ctx.lineWidth = 6; ctx.strokeRect(3, 3, 174, 224)
    ctx.fillStyle = '#d6dde8'; ctx.fillRect(66, 16, 48, 10)
    ctx.font = '900 112px Montserrat, Arial, sans-serif'; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('A', 82, 132)
    ctx.fillStyle = '#0050F5'; ctx.beginPath(); ctx.arc(140, 166, 12, 0, Math.PI * 2); ctx.fill()
  }) })
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.19, 0.012), [white, white, white, white, badgeFace, white])
  badge.position.set(0, 1.55, 0.338); badge.rotation.x = -0.05
  body.add(badge)

  // Hanging arm (with watch) and waving arm.
  const shoulderL = v(0.5, 1.95, 0), elbowL = v(0.68, 1.5, 0.02), wristL = v(0.7, 1.08, 0.24)
  body.add(segment(v(0.43, 2.0, 0), v(0.62, 1.74, 0.03), 0.19, 0.155, shirt))
  body.add(new THREE.Mesh(new THREE.CircleGeometry(0.15, 24), shirtDark).translateX(0.62).translateY(1.74).translateZ(0.03).rotateX(Math.PI / 2 - 0.65).rotateY(-0.6))
  body.add(limb(shoulderL, elbowL, 0.08, skin), limb(elbowL, wristL, 0.072, skin))
  const watch = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.022, 8, 24), ink)
  watch.position.set(0.698, 1.16, 0.215); watch.rotation.set(Math.PI / 2, 0, 0.05)
  body.add(watch, ellipsoid([0.05, 0.012, 0.04], [0.7, 1.165, 0.29], ink))
  body.add(ellipsoid([0.085, 0.1, 0.06], [0.7, 1.0, 0.26], skin))
  for (const [dx, dz, len] of [[-0.05, 0.02, 0.17], [0, 0.04, 0.2], [0.05, 0.02, 0.17]]) {
    const start = v(0.7 + dx, 0.96, 0.26 + dz), end = start.clone().add(v(dx * 0.6, -len, 0.05))
    body.add(limb(start, end, 0.03, skin), ellipsoid([0.04, 0.036, 0.04], end.toArray() as [number, number, number], skin))
  }

  const shoulderR = v(-0.5, 1.95, 0), elbowR = v(-0.92, 1.66, 0.14)
  body.add(segment(v(-0.43, 2.0, 0), v(-0.64, 1.8, 0.05), 0.19, 0.155, shirt))
  body.add(limb(shoulderR, elbowR, 0.08, skin))
  const forearm = new THREE.Group()
  forearm.position.copy(elbowR)
  forearm.add(limb(v(0, 0, 0), v(-0.06, 0.5, 0.06), 0.072, skin))
  forearm.add(ellipsoid([0.11, 0.12, 0.05], [-0.07, 0.62, 0.07], skin))
  for (const [angle, len] of [[0.45, 0.2], [0.15, 0.25], [-0.15, 0.25], [-0.45, 0.2]]) {
    const start = v(-0.07 - angle * 0.12, 0.68, 0.07)
    const end = start.clone().add(v(-Math.sin(angle) * len, Math.cos(angle) * len, 0.02))
    forearm.add(limb(start, end, 0.028, skin), ellipsoid([0.038, 0.038, 0.034], end.toArray() as [number, number, number], skin))
  }
  const thumbStart = v(0.03, 0.58, 0.08), thumbEnd = v(0.14, 0.68, 0.1)
  forearm.add(limb(thumbStart, thumbEnd, 0.028, skin), ellipsoid([0.036, 0.036, 0.032], thumbEnd.toArray() as [number, number, number], skin))
  body.add(forearm)

  // Neck and head
  body.add(limb(v(0, 2.08, 0), v(0, 2.5, 0.06), 0.17, skin))
  const head = new THREE.Group()
  head.position.set(0, 2.8, 0.04)
  head.scale.setScalar(1.12)
  body.add(head)
  head.add(ellipsoid([0.5, 0.46, 0.5], [0, 0.04, -0.06], skin))
  head.add(ellipsoid([0.46, 0.31, 0.44], [0, -0.13, 0.3], skin))
  head.add(ellipsoid([0.4, 0.2, 0.42], [0, -0.3, 0.08], skin))

  // Casque: rounded pointed crest rising from the top-back of the head.
  const dome = [[0.001, 0], [0.42, 0], [0.4, 0.14], [0.31, 0.32], [0.18, 0.47], [0.07, 0.57], [0.02, 0.61], [0.001, 0.62]].map(([x, y]) => new THREE.Vector2(x, y))
  const casque = new THREE.Mesh(new THREE.LatheGeometry(new THREE.SplineCurve(dome).getPoints(40), 48), skin)
  casque.position.set(0, 0.12, -0.12); casque.scale.set(0.82, 1, 1.1); casque.rotation.x = -0.42
  head.add(casque)

  // Wide smile following the snout surface.
  const smile: THREE.Vector3[] = []
  for (let i = 0; i <= 40; i++) {
    const a = -1.32 + (i / 40) * 2.64, k = 1.012
    smile.push(v(Math.sin(a) * 0.46 * 0.96 * k, -0.2 + 0.075 * a * a, 0.3 + Math.cos(a) * 0.44 * 0.96 * k))
  }
  head.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(smile), 60, 0.014, 6), ink))
  for (const side of [-1, 1]) head.add(ellipsoid([0.014, 0.01, 0.01], [0.07 * side, -0.02, 0.73], ink))

  const pupils: THREE.Group[] = []
  const eyes: THREE.Group[] = []
  for (const side of [-1, 1]) {
    const center = v(0.25 * side, 0.12, 0.36)
    head.add(ellipsoid([0.27, 0.26, 0.24], center.toArray() as [number, number, number], skin))
    const eye = new THREE.Group()
    eye.position.copy(center).add(v(0.01 * side, 0.01, 0.07))
    const look = new THREE.Group()
    const irisMesh = ellipsoid([0.135, 0.135, 0.06], [0, 0, 0.195], iris)
    const pupil = ellipsoid([0.06, 0.06, 0.03], [0, 0, 0.243], new THREE.MeshStandardMaterial({ color: '#02060f', roughness: 0.1 }))
    const shine = ellipsoid([0.024, 0.024, 0.01], [0.05, 0.055, 0.257], new THREE.MeshBasicMaterial({ color: '#ffffff' }))
    look.add(irisMesh, pupil, shine)
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 16, 0, Math.PI * 2, 0, 0.72), skin)
    lid.rotation.x = 0.55
    eye.add(new THREE.Mesh(new THREE.SphereGeometry(0.235, 32, 24), white), look, lid)
    head.add(eye)
    eyes.push(eye); pupils.push(look)

    const rim = new THREE.Mesh(frameGeometry(0.5, 0.41, 0.17, 0.065), glasses)
    rim.position.set(0.26 * side, 0.13, 0.74); rim.rotation.y = 0.16 * side
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.39, 0.3), lens)
    glass.position.copy(rim.position); glass.rotation.copy(rim.rotation)
    head.add(rim, glass)
    head.add(limb(v(0.5 * side, 0.17, 0.66), v(0.52 * side, 0.19, -0.02), 0.022, glasses))
  }
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.024, 10, 20, Math.PI), glasses)
  bridge.position.set(0, 0.16, 0.73)
  head.add(bridge)

  // Tail: leaves the back, then curls into a big spiral beside the right leg.
  const points = [v(0.12, 1.0, -0.26), v(0.42, 0.7, -0.4), v(0.78, 0.36, -0.42)]
  const center = v(1.2, 0.64, -0.36), turns = 1.8, steps = 70
  for (let k = 1; k <= steps; k++) {
    const t = k / steps, r = 0.5 * (1 - t * 0.86), a = -Math.PI * 0.62 + t * turns * Math.PI * 2
    points.push(v(center.x + Math.cos(a) * r, center.y + Math.sin(a) * r, center.z + t * 0.08))
  }
  body.add(new THREE.Mesh(taperedTube(new THREE.CatmullRomCurve3(points), 260, 20, 0.17, 0.032), tailSkin))

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 1.9), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, map: canvasTexture(256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(0,80,245,.55)'); g.addColorStop(0.45, 'rgba(0,40,140,.28)'); g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256)
  }) }))
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0.35, 0.005, 0)
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
    renderer.toneMappingExposure = 1.1
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    camera.position.set(0, 2.1, 10)
    camera.lookAt(0.2, 1.82, 0)

    scene.add(new THREE.HemisphereLight('#dfe9ff', '#0a1636', 1.5))
    const key = new THREE.DirectionalLight('#ffffff', 2.3)
    key.position.set(2.5, 5, 6)
    const rim = new THREE.DirectionalLight('#5d9bff', 3.4)
    rim.position.set(-4, 3, -4)
    const back = new THREE.DirectionalLight('#9cc2ff', 1.6)
    back.position.set(4, 2, -3)
    const fill = new THREE.PointLight('#7fb0ff', 5, 12)
    fill.position.set(-2.5, 1.5, 3)
    scene.add(key, rim, back, fill)

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
      root.rotation.y = damp(root.rotation.y, -0.2 + pointer.x * 0.35 + spin, 5, dt)
      head.rotation.y = damp(head.rotation.y, pointer.x * 0.35, 6, dt)
      head.rotation.x = damp(head.rotation.x, -pointer.y * 0.18, 6, dt)
      for (const look of pupils) {
        look.rotation.y = damp(look.rotation.y, pointer.x * 0.45, 10, dt)
        look.rotation.x = damp(look.rotation.x, -pointer.y * 0.35, 10, dt)
      }
      if (!reducedMotion) {
        body.position.y = Math.sin(t * 1.8) * 0.025
        torso.scale.x = 1 + Math.sin(t * 1.8) * 0.012
        forearm.rotation.z = Math.sin(t * 5.5) * 0.25 - 0.05
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
