// src/test/components/BOMTable.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BOMTable from '../../components/BOMTable'

const mockItems = [
  { item: 'Solar panel', qty: 4, unit: 'unit', unit_price_usd: 120, total_usd: 480 },
  { item: 'Battery', qty: 6, unit: 'unit', unit_price_usd: 120, total_usd: 720 },
]

describe('BOMTable', () => {
  it('renders all items', () => {
    render(<BOMTable items={mockItems} total={1200} />)
    expect(screen.getByText('Solar panel')).toBeInTheDocument()
    expect(screen.getByText('Battery')).toBeInTheDocument()
  })

  it('shows total at the bottom', () => {
    render(<BOMTable items={mockItems} total={1200} />)
    expect(screen.getByText('$1200')).toBeInTheDocument()
  })

  it('renders correct number of rows', () => {
    render(<BOMTable items={mockItems} total={1200} />)
    const rows = screen.getAllByRole('row')
    // header + 2 items + footer = 4
    expect(rows).toHaveLength(4)
  })
})