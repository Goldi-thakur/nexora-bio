export interface Stage {
  index: string
  label: string
  description: string
}

export const stages: Stage[] = [
  {
    index: '01',
    label: 'Discover',
    description: 'Identify biological signals and patterns worth pursuing, at the scale where they first become visible.',
  },
  {
    index: '02',
    label: 'Design',
    description: 'Translate a discovery into a defined system — components, interactions, and the outcome they should produce.',
  },
  {
    index: '03',
    label: 'Validate',
    description: 'Test the system against reality, iterating until behavior matches prediction under real conditions.',
  },
  {
    index: '04',
    label: 'Scale',
    description: 'Move a validated system from the lab into a form that performs reliably at production scale.',
  },
]
