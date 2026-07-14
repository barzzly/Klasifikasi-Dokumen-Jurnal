import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FileDropzone from '../src/components/FileDropzone'
import { validateFile } from '../src/utils/validation'

function makeFile(name, type, sizeBytes) {
  const blob = new Blob(['a'.repeat(Math.min(sizeBytes, 1024))], { type })
  const file = new File([blob], name, { type })
  Object.defineProperty(file, 'size', { value: sizeBytes })
  return file
}

describe('validateFile', () => {
  it('accepts a valid PDF within size limit', () => {
    const file = makeFile('paper.pdf', 'application/pdf', 1024)
    expect(validateFile(file).valid).toBe(true)
  })

  it('rejects a non-PDF file', () => {
    const file = makeFile('notes.txt', 'text/plain', 1024)
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/PDF/i)
  })

  it('rejects a file over the size limit', () => {
    const file = makeFile('big.pdf', 'application/pdf', 20 * 1024 * 1024)
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/maksimum/i)
  })
})

describe('FileDropzone', () => {
  it('renders the selected file name and size', () => {
    const file = makeFile('paper.pdf', 'application/pdf', 2048)
    render(
      <FileDropzone
        file={file}
        onSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    )
    expect(screen.getByText('paper.pdf')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hapus berkas/i })).toBeInTheDocument()
  })

  it('is keyboard operable when empty', async () => {
    const user = userEvent.setup()
    render(<FileDropzone file={null} onSelect={vi.fn()} onRemove={vi.fn()} />)
    const zone = screen.getByRole('button', { name: /area unggah/i })
    expect(zone).toHaveAttribute('tabindex', '0')
    await user.tab()
    expect(zone).toHaveFocus()
  })
})
