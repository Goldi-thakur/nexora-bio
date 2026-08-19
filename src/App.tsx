import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Innovation from './components/Innovation'
import Research from './components/Research'
import Capabilities from './components/Capabilities'
import Impact from './components/Impact'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import BioNetworkLayer, { BioNetworkHandle } from './components/BioNetworkLayer'
import { TopologyName } from './utils/bioNetwork'

// Each narrative section owns a target network topology + a background
// opacity for the shared canvas layer sitting behind it.
const SECTION_CONFIG: Record<string, { topology: TopologyName; opacity: number }> = {
  top: { topology: 'scatter', opacity: 0.9 },
  science: { topology: 'branch', opacity: 0.4 },
  technology: { topology: 'branch', opacity: 0.28 },
  capabilities: { topology: 'process', opacity: 0.32 },
  impact: { topology: 'converged', opacity: 0.22 },
  cta: { topology: 'converged', opacity: 0.75 },
}

export default function App() {
  const networkRef = useRef<BioNetworkHandle>(null)
  const [opacity, setOpacity] = useState(0.9)

  useEffect(() => {
    const ids = Object.keys(SECTION_CONFIG)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null
        for (const entry of entries) {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.ratio)) {
            best = { id: entry.target.id, ratio: entry.intersectionRatio }
          }
        }
        if (best) {
          const cfg = SECTION_CONFIG[best.id]
          if (cfg) {
            networkRef.current?.morphTo(cfg.topology)
            setOpacity(cfg.opacity)
          }
        }
      },
      { threshold: [0.2, 0.4, 0.6, 0.8] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative">
      <BioNetworkLayer ref={networkRef} opacity={opacity} />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Innovation />
        <Research />
        <Capabilities onStageActive={(stage) => networkRef.current?.morphTo('process', stage)} />
        <Impact />
        <FinalCTA />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
