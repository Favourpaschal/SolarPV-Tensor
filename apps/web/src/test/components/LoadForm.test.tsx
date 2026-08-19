// src/test/components/LoadForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoadForm from '../../components/LoadForm'

describe('LoadForm', () => {
  it('renders initial appliance row', () => {
    render(<LoadForm onSubmit={vi.fn()} />)
    expect(screen.getByPlaceholderText('Appliance name')).toBeInTheDocument()
  })

  it('adds a new row when Add appliance is clicked', () => {
    render(<LoadForm onSubmit={vi.fn()} />)
    const addBtn = screen.getByText('Add appliance')
    fireEvent.click(addBtn)
    const inputs = screen.getAllByPlaceholderText('Appliance name')
    expect(inputs).toHaveLength(2)
  })

  it('removes a row when Remove is clicked', () => {
    render(<LoadForm onSubmit={vi.fn()} />)
    fireEvent.click(screen.getByText('Add appliance'))
    const removeBtns = screen.getAllByText('Remove')
    fireEvent.click(removeBtns[0])
    const inputs = screen.getAllByPlaceholderText('Appliance name')
    expect(inputs).toHaveLength(1)
  })
})