import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-cta-reveal]', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="cta"
      ref={rootRef}
      className="relative flex min-h-[80vh] flex-col items-center justify-center py-32 text-center"
    >
      <div className="container-edge relative z-10 flex flex-col items-center">
        <p data-cta-reveal className="eyebrow mb-8">
          The Next Breakthrough
        </p>
        <h2 data-cta-reveal className="max-w-3xl font-display text-4xl leading-[1.05] text-paper-100 sm:text-5xl md:text-7xl">
          The next breakthrough is already inside biology.
        </h2>
        <p data-cta-reveal className="mt-8 max-w-lg font-body text-base leading-relaxed text-paper-300 md:text-lg">
          Explore how engineered biology can move ideas from possibility to measurable impact.
        </p>
        <a
          data-cta-reveal
          href="#technology"
          className="mt-12 rounded-full bg-mint-400 px-9 py-4 font-mono text-[12px] uppercase tracking-widest2 text-ink-950 transition-transform duration-300 hover:scale-[1.04]"
        >
          Explore Nexora Bio
        </a>
      </div>
    </section>
  )
}
