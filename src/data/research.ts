export interface ResearchArea {
  index: string
  title: string
  description: string
  detail: string
}

export const researchAreas: ResearchArea[] = [
  {
    index: '01',
    title: 'Computational Biology',
    description: 'Mapping biological complexity through computation, modeling, and intelligent analysis.',
    detail:
      'We build models that read biological systems the way a language has grammar — finding the rules beneath the noise of gene expression, protein folding, and cellular signaling.',
  },
  {
    index: '02',
    title: 'Precision Therapeutics',
    description: 'Designing targeted approaches that operate with greater biological precision.',
    detail:
      'Every intervention we design is built around a specific mechanism, tested against a specific pathway, and measured against a specific outcome — precision over breadth.',
  },
  {
    index: '03',
    title: 'Synthetic Systems',
    description: 'Engineering biological components into programmable, measurable systems.',
    detail:
      'Biological components become building blocks — combined, tested, and refined until they behave as reliably as the engineered systems we depend on elsewhere.',
  },
]
