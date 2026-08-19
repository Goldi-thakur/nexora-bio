const LINKS = ['Science', 'Technology', 'Research', 'Impact']

export default function Footer() {
  return (
    <footer className="relative border-t border-ink-600 py-16">
      <div className="container-edge flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[13px] uppercase tracking-widest2 text-paper-100">Nexora Bio</p>
          <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-paper-500">
            Engineering biology for what comes next.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-10 gap-y-4" aria-label="Footer">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="link-draw font-mono text-[11px] uppercase tracking-widest2 text-paper-500 transition-colors hover:text-paper-100"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="font-mono text-[11px] leading-relaxed text-paper-500">
          <p>Nexora Bio, Inc.</p>
          <p>440 Helix Avenue, Cambridge, MA</p>
          <p className="mt-3">
            <a href="mailto:research@nexorabio.com" className="link-draw hover:text-paper-100">
              research@nexorabio.com
            </a>
          </p>
        </div>
      </div>

      <div className="container-edge mt-16 flex flex-col gap-4 border-t border-ink-600 pt-8 text-[11px] text-paper-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">© {new Date().getFullYear()} Nexora Bio, Inc. All rights reserved.</p>
        <p className="font-mono">Fictional research entity for demonstration purposes.</p>
      </div>
    </footer>
  )
}
