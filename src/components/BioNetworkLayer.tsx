import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { BioNetwork, TopologyName } from '../utils/bioNetwork'
import { useReducedMotion } from '../hooks/useReducedMotion'

export interface BioNetworkHandle {
  morphTo: (name: TopologyName, stage?: number) => void
}

interface Props {
  opacity: number
}

// A single canvas, fixed to the viewport, that renders behind every section.
// Its topology is driven externally (via the ref) as the reader scrolls,
// so the "living network" from the hero is literally the same system that
// reorganizes throughout the page rather than a decorative repeat.
const BioNetworkLayer = forwardRef<BioNetworkHandle, Props>(({ opacity }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<BioNetwork | null>(null)
  const reducedMotion = useReducedMotion()

  useImperativeHandle(ref, () => ({
    morphTo: (name, stage) => engineRef.current?.morphTo(name, stage),
  }))

  useEffect(() => {
    if (!canvasRef.current) return
    const engine = new BioNetwork(canvasRef.current, { reducedMotion })
    engineRef.current = engine
    engine.resize()
    engine.start()

    const onResize = () => engine.resize()
    window.addEventListener('resize', onResize)

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const rect = canvasRef.current!.getBoundingClientRect()
      engine.setPointer(e.clientX - rect.left, e.clientY - rect.top, true)
    }
    const onPointerLeave = () => engine.setPointer(-9999, -9999, false)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)

    return () => {
      engine.stop()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    engineRef.current?.setReducedMotion(reducedMotion)
  }, [reducedMotion])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[1200ms] ease-out"
      style={{ opacity }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
})

BioNetworkLayer.displayName = 'BioNetworkLayer'

export default BioNetworkLayer
