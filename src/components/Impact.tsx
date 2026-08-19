import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stats } from '../data/stats'

gsap.registerPlugin(ScrollTrigger)

function formatValue(v: number, decimals: number, pad?: number) {
  const fixed = v.toFixed(decimals)
  if (pad) return fixed.padStart(pad, '0')
  return fixed
}

export default function Impact() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-impact-reveal]', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      })

      gsap.utils.toArray<HTMLElement>('[data-stat-value]').forEach((el) => {
        const target = Number(el.dataset.target)
        const decimals = Number(el.dataset.decimals)
        const pad = el.dataset.pad ? Number(el.dataset.pad) : undefined
        const counter = { val: 0 }
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = formatValue(counter.val, decimals, pad)
          },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="impact" ref={rootRef} className="relative py-32 md:py-44">
      <div className="container-edge">
        <p data-impact-reveal className="eyebrow mb-8">
          Impact
        </p>
        <h2 data-impact-reveal className="max-w-2xl font-display text-4xl leading-[1.08] text-paper-100 sm:text-5xl md:text-6xl">
          Complexity, made measurable.
        </h2>

        <div className="mt-24 grid gap-y-16 border-t border-ink-600 pt-16 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} data-impact-reveal className="flex flex-col gap-4">
              <span className="font-display text-6xl leading-none text-paper-100 md:text-7xl">
                <span
                  data-stat-value
                  data-target={s.value}
                  data-decimals={s.decimals}
                  data-pad={s.pad}
                >
                  {formatValue(0, s.decimals, s.pad)}
                </span>
                <span className="text-mint-400">{s.suffix}</span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest2 text-paper-500">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
