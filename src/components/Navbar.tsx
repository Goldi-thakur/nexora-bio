import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Science', href: '#science' },
  { label: 'Technology', href: '#technology' },
  { label: 'Impact', href: '#impact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-ink-950/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-edge flex h-20 items-center justify-between">
        <a
          href="#top"
          className="font-mono text-[13px] uppercase tracking-widest2 text-paper-100 link-draw"
        >
          Nexora Bio
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-draw font-mono text-[12px] uppercase tracking-widest2 text-paper-300 transition-colors hover:text-paper-100"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#technology"
            className="rounded-full border border-mint-400/40 px-5 py-2 font-mono text-[11px] uppercase tracking-widest2 text-mint-400 transition-colors hover:border-mint-400 hover:bg-mint-400/10"
          >
            Explore Research
          </a>
        </nav>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`block h-px w-6 bg-paper-100 transition-transform duration-300 ${
              menuOpen ? 'translate-y-[3px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-6 bg-paper-100 transition-all duration-300 ${
              menuOpen ? '-translate-y-[3px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-ink-950 px-8 transition-opacity duration-500 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-8" aria-label="Mobile">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl text-paper-100 transition-transform duration-500"
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#technology"
            onClick={() => setMenuOpen(false)}
            className="mt-4 w-fit rounded-full border border-mint-400/40 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-mint-400"
          >
            Explore Research
          </a>
        </nav>
      </div>
    </header>
  )
}
