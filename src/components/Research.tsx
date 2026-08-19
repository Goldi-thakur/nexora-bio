import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { researchAreas } from '../data/research'

gsap.registerPlugin(ScrollTrigger)

export default function Research() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-research-reveal]', {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: rootRef.current, start: 'top 72%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="technology" ref={rootRef} className="relative py-32 md:py-44">
      <div className="container-edge">
        <p data-research-reveal className="eyebrow mb-8">
          Technology
        </p>
        <h2 data-research-reveal className="max-w-2xl font-display text-4xl leading-[1.08] text-paper-100 sm:text-5xl md:text-6xl">
          From biological complexity to engineered possibility.
        </h2>

        <div className="mt-20 border-t border-ink-600">
          {researchAreas.map((area, i) => (
            <button
              key={area.index}
              type="button"
              data-research-reveal
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
              className="group grid w-full grid-cols-1 gap-4 border-b border-ink-600 py-10 text-left transition-colors duration-500 md:grid-cols-12 md:items-baseline md:gap-6 md:py-12"
            >
              <span
                className={`font-mono text-sm transition-colors duration-500 md:col-span-1 ${
                  active === i ? 'text-mint-400' : 'text-paper-500'
                }`}
              >
                {area.index}
              </span>

              <h3
                className={`font-display text-2xl transition-all duration-500 md:col-span-4 md:text-3xl ${
                  active === i ? 'translate-x-2 text-paper-100' : 'text-paper-100/90'
                }`}
              >
                {area.title}
              </h3>

              <p className="font-body text-sm leading-relaxed text-paper-300 md:col-span-4 md:text-base">
                {area.description}
              </p>

              <p
                className={`overflow-hidden font-body text-sm leading-relaxed text-paper-500 transition-all duration-500 md:col-span-3 ${
                  active === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 md:max-h-40 md:opacity-0'
                }`}
              >
                {area.detail}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
