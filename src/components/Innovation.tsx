import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CONCEPTS = [
  {
    index: '01',
    title: 'Observe',
    copy: 'Understand biological signals and patterns before assuming what they mean.',
  },
  {
    index: '02',
    title: 'Model',
    copy: 'Translate complexity into computational systems that can be tested and trusted.',
  },
  {
    index: '03',
    title: 'Engineer',
    copy: 'Design biological solutions with precision, built to behave as predicted.',
  },
]

export default function Innovation() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 70%',
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-concept]').forEach((el, i) => {
        gsap.from(el.querySelector('[data-concept-line]'), {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 78%' },
          delay: i * 0.08,
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="science" ref={rootRef} className="relative py-32 md:py-44">
      <div className="container-edge">
        <p data-reveal className="eyebrow mb-8">
          Innovation
        </p>

        <h2 data-reveal className="max-w-3xl font-display text-4xl leading-[1.08] text-paper-100 sm:text-5xl md:text-6xl">
          Biology is the most sophisticated technology on Earth.
        </h2>

        <p data-reveal className="mt-8 max-w-xl font-body text-base leading-relaxed text-paper-300 md:text-lg">
          We study biological systems at the level where complexity becomes information — then
          transform that information into new possibilities.
        </p>

        <div className="mt-24 grid gap-0 border-t border-ink-600 md:grid-cols-3">
          {CONCEPTS.map((c) => (
            <div
              key={c.index}
              data-concept
              className="group relative border-b border-ink-600 py-10 pr-8 md:border-b-0 md:border-r md:py-14 md:last:border-r-0"
            >
              <div data-concept-line className="absolute left-0 top-0 h-px w-full bg-mint-400/50" />
              <span className="font-mono text-[11px] text-paper-500">{c.index}</span>
              <h3 className="mt-6 font-display text-2xl text-paper-100 md:text-3xl">{c.title}</h3>
              <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-paper-300">{c.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
