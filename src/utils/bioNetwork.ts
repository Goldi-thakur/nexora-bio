// BioNetwork — a persistent, morphing node-and-edge visualization that acts as
// the connective visual thread of the entire page. Rather than a decorative
// hero graphic, it is one continuous system whose *topology* changes as the
// reader moves through the narrative (scattered → branching → structured →
// converged), rendered on a single canvas that sits behind the page content.

export type TopologyName = 'scatter' | 'branch' | 'process' | 'converged'

interface Node {
  // normalized home position for the current topology, 0..1 of canvas size
  tx: number
  ty: number
  // current interpolated position (canvas px)
  x: number
  y: number
  // velocity used for smooth morphing (critically damped spring)
  vx: number
  vy: number
  r: number
  phase: number
  layer: number // 0 = back (dim), 1 = mid, 2 = front (bright) — for depth
}

interface Edge {
  a: number
  b: number
  strength: number // 0..1, controls opacity baseline
  phase: number
}

interface Particle {
  edge: number
  t: number
  speed: number
}

const NODE_COUNT = 84

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by)
}

export class BioNetwork {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private nodes: Node[] = []
  private edges: Edge[] = []
  private particles: Particle[] = []
  private width = 0
  private height = 0
  private dpr = 1
  private raf = 0
  private time = 0
  private pointer = { x: -9999, y: -9999, active: false }
  private topology: TopologyName = 'scatter'
  private stageProgress = 0 // 0..1 for 'process' topology sub-stage
  private reducedMotion = false
  private lastFrame = 0
  private accent = { mint: '95,227,164', ice: '143,203,224', violet: '168,149,217' }

  constructor(canvas: HTMLCanvasElement, opts?: { reducedMotion?: boolean }) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    this.ctx = ctx
    this.reducedMotion = opts?.reducedMotion ?? false

    const rand = seededRandom(1337)
    for (let i = 0; i < NODE_COUNT; i++) {
      const layer = i % 5 === 0 ? 2 : i % 3 === 0 ? 0 : 1
      this.nodes.push({
        tx: rand(),
        ty: rand(),
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: layer === 2 ? 2.6 : layer === 1 ? 1.7 : 1.1,
        phase: rand() * Math.PI * 2,
        layer,
      })
    }

    this.buildTopology('scatter')
    this.resize()

    for (let i = 0; i < 22; i++) {
      this.particles.push({
        edge: Math.floor(rand() * Math.max(this.edges.length, 1)),
        t: rand(),
        speed: 0.08 + rand() * 0.12,
      })
    }
  }

  setReducedMotion(v: boolean) {
    this.reducedMotion = v
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.width = rect.width
    this.height = rect.height
    this.canvas.width = Math.round(rect.width * this.dpr)
    this.canvas.height = Math.round(rect.height * this.dpr)
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    this.applyPositionsFromNormalized()
  }

  setPointer(x: number, y: number, active: boolean) {
    this.pointer.x = x
    this.pointer.y = y
    this.pointer.active = active
  }

  private applyPositionsFromNormalized() {
    for (const n of this.nodes) {
      n.x = n.tx * this.width
      n.y = n.ty * this.height
    }
  }

  // Build normalized target positions + edges for a given topology.
  private buildTopology(name: TopologyName, stage = 0) {
    const rand = seededRandom(42)
    this.topology = name
    this.stageProgress = stage

    if (name === 'scatter') {
      this.nodes.forEach((n) => {
        n.tx = 0.08 + rand() * 0.84
        n.ty = 0.08 + rand() * 0.84
      })
    } else if (name === 'branch') {
      // three radiating branch clusters (OBSERVE / MODEL / ENGINEER)
      const centers = [
        { x: 0.22, y: 0.28 },
        { x: 0.52, y: 0.62 },
        { x: 0.82, y: 0.3 },
      ]
      this.nodes.forEach((n, i) => {
        const c = centers[i % 3]
        const angle = rand() * Math.PI * 2
        const radius = rand() * 0.16
        n.tx = c.x + Math.cos(angle) * radius
        n.ty = c.y + Math.sin(angle) * radius * 1.3
      })
    } else if (name === 'process') {
      // four horizontal bands (DISCOVER → DESIGN → VALIDATE → SCALE)
      // stage 0..3 controls how tightly later bands have "resolved" into order
      const bands = 4
      this.nodes.forEach((n, i) => {
        const band = i % bands
        const withinBand = Math.floor(i / bands) / (NODE_COUNT / bands)
        const resolved = band <= stage
        const bx = 0.12 + (band / (bands - 1)) * 0.76
        if (resolved) {
          n.tx = bx + (rand() - 0.5) * 0.03
          n.ty = 0.18 + withinBand * 0.64
        } else {
          n.tx = bx + (rand() - 0.5) * 0.14
          n.ty = 0.1 + rand() * 0.8
        }
      })
    } else if (name === 'converged') {
      this.nodes.forEach((n) => {
        const angle = rand() * Math.PI * 2
        const radius = Math.pow(rand(), 0.55) * 0.34
        n.tx = 0.5 + Math.cos(angle) * radius * 1.05
        n.ty = 0.5 + Math.sin(angle) * radius
      })
    }

    this.rebuildEdges()
  }

  private rebuildEdges() {
    const edges: Edge[] = []
    const rand = seededRandom(7)
    const maxNeighborDist = this.topology === 'converged' ? 0.22 : this.topology === 'scatter' ? 0.16 : 0.19
    for (let i = 0; i < this.nodes.length; i++) {
      let links = 0
      const maxLinks = this.topology === 'converged' ? 5 : 3
      for (let j = i + 1; j < this.nodes.length && links < maxLinks; j++) {
        const a = this.nodes[i]
        const b = this.nodes[j]
        const d = dist(a.tx, a.ty, b.tx, b.ty)
        if (d < maxNeighborDist) {
          edges.push({ a: i, b: j, strength: 0.25 + rand() * 0.55, phase: rand() * Math.PI * 2 })
          links++
        }
      }
    }
    this.edges = edges
  }

  morphTo(name: TopologyName, stage = 0) {
    if (this.reducedMotion) {
      this.buildTopology(name, stage)
      this.applyPositionsFromNormalized()
      return
    }
    this.buildTopology(name, stage)
  }

  start() {
    const loop = (t: number) => {
      const dt = Math.min((t - this.lastFrame) / 1000, 0.05) || 0
      this.lastFrame = t
      this.time = t / 1000
      this.step(dt)
      this.draw()
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  stop() {
    cancelAnimationFrame(this.raf)
  }

  private step(dt: number) {
    const w = this.width
    const h = this.height
    const idle = this.reducedMotion ? 0 : 1

    for (const n of this.nodes) {
      let targetX = n.tx * w
      let targetY = n.ty * h

      if (idle) {
        targetX += Math.sin(this.time * 0.35 + n.phase) * 6
        targetY += Math.cos(this.time * 0.3 + n.phase * 1.4) * 6
      }

      if (this.pointer.active && idle) {
        const d = dist(n.x, n.y, this.pointer.x, this.pointer.y)
        const influence = Math.max(0, 1 - d / 160)
        if (influence > 0) {
          const ang = Math.atan2(n.y - this.pointer.y, n.x - this.pointer.x)
          targetX += Math.cos(ang) * influence * 18
          targetY += Math.sin(ang) * influence * 18
        }
      }

      // critically-damped spring toward target (smooth morph, no overshoot)
      const stiffness = 26
      const damping = 9
      const ax = (targetX - n.x) * stiffness - n.vx * damping
      const ay = (targetY - n.y) * stiffness - n.vy * damping
      n.vx += ax * dt
      n.vy += ay * dt
      n.x += n.vx * dt
      n.y += n.vy * dt
    }

    if (idle) {
      for (const p of this.particles) {
        p.t += p.speed * dt
        if (p.t >= 1) {
          p.t = 0
          p.edge = Math.floor(Math.random() * Math.max(this.edges.length, 1))
        }
      }
    }
  }

  private draw() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    // edges
    for (const e of this.edges) {
      const a = this.nodes[e.a]
      const b = this.nodes[e.b]
      if (!a || !b) continue
      const pulse = this.reducedMotion ? 0.6 : 0.55 + Math.sin(this.time * 0.8 + e.phase) * 0.35
      const alpha = Math.max(0, e.strength * pulse * 0.35)
      ctx.strokeStyle = `rgba(${this.accent.ice},${alpha})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }

    // particles traveling along edges
    if (!this.reducedMotion) {
      for (const p of this.particles) {
        const e = this.edges[p.edge]
        if (!e) continue
        const a = this.nodes[e.a]
        const b = this.nodes[e.b]
        if (!a || !b) continue
        const x = a.x + (b.x - a.x) * p.t
        const y = a.y + (b.y - a.y) * p.t
        ctx.beginPath()
        ctx.fillStyle = `rgba(${this.accent.mint},0.85)`
        ctx.arc(x, y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // nodes
    for (const n of this.nodes) {
      const glow = n.layer === 2 ? 0.9 : n.layer === 1 ? 0.55 : 0.3
      const color = n.layer === 2 ? this.accent.mint : n.layer === 0 ? this.accent.violet : this.accent.ice
      ctx.beginPath()
      ctx.fillStyle = `rgba(${color},${glow})`
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
