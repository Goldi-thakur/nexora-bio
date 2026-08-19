import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stages } from '../data/capabilities'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  onStageActive: (stage: number) => void
}

export default function Capabilities({ onStageActive }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const stageEls = gsap.utils.toArray<HTMLElement>('[data-stage]')
    const triggers = stageEls.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: () => {
          setActiveStage(i)
          onStageActive(i)
        },
        onEnterBack: () => {
          setActiveStage(i)
          onStageActive(i)
        },
      }),
    )

    const ctx = gsap.context(() => {
      gsap.from('[data-cap-reveal]', {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 72%' },
      })
    }, rootRef)

    return () => {
      triggers.forEach((t) => t.kill())
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id="capabilities" ref={rootRef} className="relative py-32 md:py-44">
      <div className="container-edge">
        <p data-cap-reveal className="eyebrow mb-8">
          Capabilities
        </p>
        <h2 data-cap-reveal className="max-w-xl font-display text-4xl leading-[1.08] text-paper-100 sm:text-5xl md:text-6xl">
          From discovery to deployment.
        </h2>
      </div>

      <div className="container-edge mt-20 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex flex-col gap-2 md:sticky md:top-32">
            {stages.map((s, i) => (
              <div
                key={s.index}
                className={`font-mono text-sm uppercase tracking-widest2 transition-colors duration-500 ${
                  activeStage === i ? 'text-mint-400' : 'text-paper-500'
                }`}
              >
                {s.index} — {s.label}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-8">
          {stages.map((s, i) => (
            <div
              key={s.index}
              data-stage
              className="flex min-h-[52vh] flex-col justify-center border-t border-ink-600 py-10 first:border-t-0 md:min-h-[60vh]"
            >
              <span
                className={`font-display text-6xl transition-colors duration-700 md:text-8xl ${
                  activeStage === i ? 'text-paper-100' : 'text-ink-600'
                }`}
              >
                {s.label}
              </span>
              <p
                className={`mt-6 max-w-md font-body text-base leading-relaxed transition-colors duration-700 md:text-lg ${
                  activeStage === i ? 'text-paper-300' : 'text-paper-500/50'
                }`}
              >
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
