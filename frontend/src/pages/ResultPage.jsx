import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

import PageContainer from '../components/PageContainer'
import ResultBadge from '../components/ResultBadge'
import StructureCard from '../components/StructureCard'
import TechnicalDetails from '../components/TechnicalDetails'
import { useAnalysis } from '../hooks/useAnalysis'
import { getModelInfo } from '../api/client'
import {
  DECISION_STAGE_LABELS,
  MODEL_NAME,
  RESULT_DISCLAIMER,
  STRUCTURE_ORDER,
} from '../utils/constants'

/** Classification result page. Redirects to /klasifikasi if no result. */
export default function ResultPage() {
  const navigate = useNavigate()
  const { result } = useAnalysis()
  const [modelClasses, setModelClasses] = useState([])

  useEffect(() => {
    if (!result) {
      navigate('/klasifikasi', { replace: true })
    }
  }, [result, navigate])

  useEffect(() => {
    let active = true
    getModelInfo()
      .then((info) => {
        if (active) setModelClasses(info.classes || [])
      })
      .catch(() => {
        // Model classes are optional context; ignore failures here.
      })
    return () => {
      active = false
    }
  }, [])

  if (!result) return null

  const missing = result.missing_structures || []
  const modelUsed = result.model?.used

  return (
    <PageContainer>
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
        Hasil Analisis
      </h1>
      <p className="mt-1 text-sm text-slate-500">Berkas: {result.filename}</p>

      <div className="mt-6 space-y-6">
        <ResultBadge label={result.final_label} />

        <div className="card p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Tahap Keputusan</p>
              <p className="font-medium text-slate-900">
                {DECISION_STAGE_LABELS[result.decision_stage] ||
                  result.decision_stage}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Model Digunakan</p>
              <p className="font-medium text-slate-900">
                {modelUsed ? `Ya — ${MODEL_NAME}` : 'Tidak'}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-700">{result.reason}</p>
        </div>

        {missing.length > 0 && (
          <div className="flex items-start gap-3 rounded-card border border-amber-300 bg-amber-50 p-4">
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <div className="text-sm text-amber-900">
              <p className="font-semibold">
                Struktur wajib belum lengkap.
              </p>
              <p className="mt-1">
                Bagian berikut tidak ditemukan:{' '}
                {missing
                  .map((k) => STRUCTURE_ORDER.includes(k) && k)
                  .filter(Boolean)
                  .join(', ')}
                . Karena itu, model klasifikasi teks tidak dijalankan.
              </p>
            </div>
          </div>
        )}

        <section aria-labelledby="struktur-heading">
          <h2 id="struktur-heading" className="font-heading text-xl font-bold">
            Status Struktur Wajib
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {STRUCTURE_ORDER.map((key) => (
              <StructureCard
                key={key}
                structureKey={key}
                item={result.structures?.[key]}
              />
            ))}
          </div>
        </section>

        <TechnicalDetails result={result} modelClasses={modelClasses} />

        <div className="flex items-start gap-3 rounded-card border border-surface bg-surface/60 p-4">
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0 text-slate-500"
            aria-hidden="true"
          />
          <p className="text-sm text-slate-600">{RESULT_DISCLAIMER}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/klasifikasi" className="btn-primary">
            <RefreshCw size={18} aria-hidden="true" />
            Analisis Dokumen Lain
          </Link>
          <Link to="/" className="btn-secondary">
            <Home size={18} aria-hidden="true" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
