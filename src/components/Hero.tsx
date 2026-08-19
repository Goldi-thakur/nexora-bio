import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('[data-hero-eyebrow]', { opacity: 0, y: 12, duration: 0.6 })
        .from('[data-hero-line]', { opacity: 0, y: 28, stagger: 0.09, duration: 0.9 }, '-=0.3')
        .from('[data-hero-sub]', { opacity: 0, y: 16, duration: 0.7 }, '-=0.5')
        .from('[data-hero-cta]', { opacity: 0, y: 12, stagger: 0.08, duration: 0.6 }, '-=0.45')
        .from('[data-hero-meta]', { opacity: 0, duration: 0.8 }, '-=0.3')
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-20 pt-40"
    >
      <div className="container-edge relative z-10">
        <p data-hero-eyebrow className="eyebrow mb-8">
          Computational Biology &amp; Synthetic Systems
        </p>

        <h1 className="max-w-4xl font-display text-[13vw] leading-[0.98] text-paper-100 sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <span data-hero-line className="block overflow-hidden">
            Engineering biology
          </span>
          <span data-hero-line className="block overflow-hidden text-paper-500">
            for what comes next.
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p data-hero-sub className="max-w-md font-body text-base leading-relaxed text-paper-300 md:text-lg">
            Nexora Bio combines computational biology, precision engineering, and advanced
            research to design biological systems with measurable human impact.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              data-hero-cta
              href="#science"
              className="rounded-full bg-mint-400 px-7 py-3.5 font-mono text-[12px] uppercase tracking-widest2 text-ink-950 transition-transform duration-300 hover:scale-[1.03]"
            >
              Explore our science
            </a>
            <a
              data-hero-cta
              href="#technology"
              className="rounded-full border border-paper-500/40 px-7 py-3.5 font-mono text-[12px] uppercase tracking-widest2 text-paper-100 transition-colors duration-300 hover:border-paper-100"
            >
              View research
            </a>
          </div>
        </div>
      </div>

      <div
        data-hero-meta
        className="container-edge relative z-10 mt-16 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-widest2 text-paper-500 sm:flex"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
        Live biological network — 84 nodes, scroll to explore
      </div>
    </section>
  )
}
