import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// Mock the API client used by the page.
vi.mock('../src/api/client', () => ({
  analyzeDocument: vi.fn(),
  analyzeText: vi.fn(),
  extractErrorMessage: (e) => e?.message || 'error',
}))

// Mock navigation so we can assert redirects without a real router history.
const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

import ClassificationPage from '../src/pages/ClassificationPage'
import { AnalysisProvider } from '../src/context/AnalysisContext'
import { analyzeText } from '../src/api/client'

function renderPage() {
  return render(
    <AnalysisProvider>
      <MemoryRouter>
        <ClassificationPage />
      </MemoryRouter>
    </AnalysisProvider>,
  )
}

describe('ClassificationPage', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    analyzeText.mockReset()
    window.sessionStorage.clear()
  })

  it('renders both input tabs', () => {
    renderPage()
    expect(screen.getByRole('tab', { name: /unggah pdf/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /tempel teks/i })).toBeInTheDocument()
  })

  it('disables the analyze button until minimum text length is reached', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('tab', { name: /tempel teks/i }))
    const analyzeBtn = screen.getByRole('button', { name: /analisis teks/i })
    expect(analyzeBtn).toBeDisabled()

    const textarea = screen.getByLabelText(/tempel teks dokumen/i)
    await user.click(textarea)
    await user.paste('x'.repeat(350))
    expect(analyzeBtn).toBeEnabled()
  })

  it('runs text analysis and navigates to the result page', async () => {
    const user = userEvent.setup()
    analyzeText.mockResolvedValue({
      filename: 'input_teks.txt',
      final_label: 'jurnal',
      decision_stage: 'text_classification',
      model: { used: true },
    })

    renderPage()
    await user.click(screen.getByRole('tab', { name: /tempel teks/i }))
    const textarea = screen.getByLabelText(/tempel teks dokumen/i)
    await user.click(textarea)
    await user.paste('x'.repeat(350))
    await user.click(screen.getByRole('button', { name: /analisis teks/i }))

    await waitFor(() => expect(analyzeText).toHaveBeenCalledTimes(1))
    expect(navigateMock).toHaveBeenCalledWith('/hasil')
  })

  it('shows an API error message when analysis fails', async () => {
    const user = userEvent.setup()
    analyzeText.mockRejectedValue(new Error('Teks terlalu pendek.'))

    renderPage()
    await user.click(screen.getByRole('tab', { name: /tempel teks/i }))
    const textarea = screen.getByLabelText(/tempel teks dokumen/i)
    await user.click(textarea)
    await user.paste('x'.repeat(350))
    await user.click(screen.getByRole('button', { name: /analisis teks/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/terlalu pendek/i)
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
