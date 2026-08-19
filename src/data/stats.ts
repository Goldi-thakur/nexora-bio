export interface Stat {
  value: number
  decimals: number
  suffix: string
  label: string
  pad?: number
}

export const stats: Stat[] = [
  { value: 98.7, decimals: 1, suffix: '%', label: 'Model prediction accuracy' },
  { value: 42, decimals: 0, suffix: '+', label: 'Research programs' },
  { value: 17, decimals: 0, suffix: '', label: 'Therapeutic targets' },
  { value: 6, decimals: 0, suffix: '', label: 'Global research partners', pad: 2 },
]
