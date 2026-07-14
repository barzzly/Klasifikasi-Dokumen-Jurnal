import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../src/api/client', () => ({
  getModelInfo: vi.fn().mockResolvedValue({ classes: ['jurnal', 'non_jurnal'] }),
}))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

import ResultPage from '../src/pages/ResultPage'
import { AnalysisContext } from '../src/context/AnalysisContext'

function renderWithResult(result) {
  const ctx = { result, setResult: vi.fn(), clearResult: vi.fn() }
  return render(
    <AnalysisContext.Provider value={ctx}>
      <MemoryRouter>
        <ResultPage />
      </MemoryRouter>
    </AnalysisContext.Provider>,
  )
}

const completeResult = {
  filename: 'dok.pdf',
  final_label: 'jurnal',
  decision_stage: 'text_classification',
  reason: 'Dokumen memenuhi struktur wajib.',
  structures: {
    abstrak: { found: true, matched_heading: 'ABSTRAK', excerpt: 'ABSTRAK ...' },
    metodologi: { found: true, matched_heading: 'METODE PENELITIAN', excerpt: 'METODE ...' },
    hasil: { found: true, matched_heading: 'HASIL', excerpt: 'HASIL ...' },
    daftar_pustaka: { found: true, matched_heading: 'DAFTAR PUSTAKA', excerpt: 'DAFTAR ...' },
  },
  missing_structures: [],
  text_length: 12345,
  model: { used: true, predicted_label: 'jurnal', decision_margin: -0.4281 },
}

const incompleteResult = {
  ...completeResult,
  final_label: 'non_jurnal',
  decision_stage: 'validasi_struktur',
  reason: 'Dokumen tidak memenuhi seluruh struktur wajib.',
  structures: {
    ...completeResult.structures,
    daftar_pustaka: { found: false, matched_heading: null, excerpt: null },
  },
  missing_structures: ['daftar_pustaka'],
  model: { used: false, predicted_label: null, decision_margin: null },
}

describe('ResultPage', () => {
  beforeEach(() => {
    navigateMock.mockReset()
  })

  it('redirects to /klasifikasi when there is no result', () => {
    renderWithResult(null)
    expect(navigateMock).toHaveBeenCalledWith('/klasifikasi', { replace: true })
  })

  it('renders the final result label', async () => {
    renderWithResult(completeResult)
    expect(await screen.findByText('Jurnal')).toBeInTheDocument()
  })

  it('renders all four structure status cards', () => {
    renderWithResult(completeResult)
    expect(screen.getByRole('heading', { name: 'Abstrak' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Metodologi' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Hasil' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Daftar Pustaka' })).toBeInTheDocument()
  })

  it('highlights missing structures and notes the model was not called', () => {
    renderWithResult(incompleteResult)
    expect(screen.getByText(/belum lengkap/i)).toBeInTheDocument()
    expect(screen.getByText(/tidak dijalankan/i)).toBeInTheDocument()
    expect(screen.getAllByText(/tidak ditemukan/i).length).toBeGreaterThan(0)
  })

  it('shows the decision-margin disclaimer inside technical details', async () => {
    const user = userEvent.setup()
    renderWithResult(completeResult)
    await user.click(screen.getByRole('button', { name: /detail teknis/i }))
    await waitFor(() =>
      expect(
        screen.getByText(/bukan probabilitas atau persentase keyakinan/i),
      ).toBeInTheDocument(),
    )
  })
})
