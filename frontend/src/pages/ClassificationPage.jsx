import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUp, Type } from 'lucide-react'

import PageContainer from '../components/PageContainer'
import FileDropzone from '../components/FileDropzone'
import TextInputPanel from '../components/TextInputPanel'
import LoadingSteps from '../components/LoadingSteps'
import ErrorAlert from '../components/ErrorAlert'
import { analyzeDocument, analyzeText, extractErrorMessage } from '../api/client'
import { useAnalysis } from '../hooks/useAnalysis'
import { validateFile } from '../utils/validation'
import { MIN_TEXT_LENGTH } from '../utils/constants'

const TAB_PDF = 'pdf'
const TAB_TEXT = 'text'

/** Upload / paste classification page. */
export default function ClassificationPage() {
  const navigate = useNavigate()
  const { setResult } = useAnalysis()

  const [tab, setTab] = useState(TAB_PDF)
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [showClassification, setShowClassification] = useState(false)

  const resetPdf = () => {
    setFile(null)
    setError(null)
  }

  const resetText = () => {
    setText('')
    setError(null)
  }

  const handleSelect = (selected) => {
    const { valid, error: validationError } = validateFile(selected)
    if (!valid) {
      setError(validationError)
      setFile(null)
      return
    }
    setError(null)
    setFile(selected)
  }

  const finishWithResult = (data) => {
    setResult(data)
    navigate('/hasil')
  }

  const runAnalysis = async (kind) => {
    if (loading) return // prevent duplicate requests

    setError(null)
    setLoading(true)
    setActiveStep(0)
    setShowClassification(false)

    try {
      // Step 1: uploading.
      setActiveStep(kind === TAB_PDF ? 0 : 1)
      // Step 2: extracting (only meaningful for PDF).
      setActiveStep(kind === TAB_PDF ? 1 : 2)

      const data =
        kind === TAB_PDF ? await analyzeDocument(file) : await analyzeText(text)

      // Step 3: structure checked. If complete, activate classification step.
      setActiveStep(2)
      if (data?.model?.used) {
        setShowClassification(true)
        setActiveStep(3)
      }

      finishWithResult(data)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const pdfDisabled = loading || !file
  const textDisabled = loading || text.trim().length < MIN_TEXT_LENGTH

  const tabClass = (value) =>
    [
      'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors',
      tab === value
        ? 'bg-primary text-white'
        : 'text-slate-600 hover:bg-surface',
    ].join(' ')

  return (
    <PageContainer>
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
        Klasifikasi Dokumen
      </h1>
      <p className="mt-2 text-slate-600">
        Unggah berkas PDF atau tempel teks dokumen ilmiah untuk dianalisis.
      </p>

      <div className="mt-6" role="tablist" aria-label="Metode masukan">
        <div className="inline-flex gap-1 rounded-lg border border-surface bg-white p-1">
          <button
            type="button"
            role="tab"
            id="tab-pdf"
            aria-selected={tab === TAB_PDF}
            aria-controls="panel-pdf"
            className={tabClass(TAB_PDF)}
            onClick={() => setTab(TAB_PDF)}
            disabled={loading}
          >
            <FileUp size={16} aria-hidden="true" />
            Unggah PDF
          </button>
          <button
            type="button"
            role="tab"
            id="tab-text"
            aria-selected={tab === TAB_TEXT}
            aria-controls="panel-text"
            className={tabClass(TAB_TEXT)}
            onClick={() => setTab(TAB_TEXT)}
            disabled={loading}
          >
            <Type size={16} aria-hidden="true" />
            Tempel Teks
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <div className="mt-6">
          <LoadingSteps
            activeStep={activeStep}
            showClassification={showClassification}
          />
        </div>
      ) : (
        <div className="mt-6">
          {tab === TAB_PDF ? (
            <div id="panel-pdf" role="tabpanel" aria-labelledby="tab-pdf" className="space-y-4">
              <FileDropzone
                file={file}
                onSelect={handleSelect}
                onRemove={resetPdf}
                disabled={loading}
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => runAnalysis(TAB_PDF)}
                  disabled={pdfDisabled}
                >
                  Analisis Dokumen
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetPdf}
                  disabled={loading || !file}
                >
                  Atur Ulang
                </button>
              </div>
            </div>
          ) : (
            <div id="panel-text" role="tabpanel" aria-labelledby="tab-text" className="space-y-4">
              <TextInputPanel value={text} onChange={setText} disabled={loading} />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => runAnalysis(TAB_TEXT)}
                  disabled={textDisabled}
                >
                  Analisis Teks
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetText}
                  disabled={loading || !text}
                >
                  Atur Ulang
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  )
}
