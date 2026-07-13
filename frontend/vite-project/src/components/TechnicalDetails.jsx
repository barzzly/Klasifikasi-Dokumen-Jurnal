import { useState } from 'react'
import PropTypes from 'prop-types'
import { ChevronDown, Info } from 'lucide-react'

import {
  DECISION_STAGE_LABELS,
  MARGIN_DISCLAIMER,
  MODEL_NAME,
} from '../utils/constants'
import { formatMargin, formatNumber } from '../utils/formatters'

/** Collapsible technical-details panel. */
export default function TechnicalDetails({ result, modelClasses }) {
  const [open, setOpen] = useState(false)
  const { model } = result

  const rows = [
    ['Panjang teks', `${formatNumber(result.text_length)} karakter`],
    ['Tahap keputusan', DECISION_STAGE_LABELS[result.decision_stage] || result.decision_stage],
    ['Model digunakan', model.used ? 'Ya' : 'Tidak'],
    ['Prediksi model', model.predicted_label ?? '—'],
    ['Nama model', MODEL_NAME],
    ['Kelas model', (modelClasses || []).join(', ') || '—'],
  ]

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 bg-surface/60 px-4 py-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-heading font-semibold text-slate-900">
          Detail Teknis
        </span>
        <ChevronDown
          size={18}
          className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="px-4 py-4">
          <dl className="divide-y divide-surface">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-1 py-2 sm:flex-row sm:justify-between"
              >
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="break-words text-sm font-medium text-slate-800">
                  {value}
                </dd>
              </div>
            ))}

            <div className="py-2">
              <dt className="text-sm text-slate-500">Margin keputusan</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">
                {formatMargin(model.decision_margin)}
              </dd>
              <p className="mt-2 flex items-start gap-2 rounded-md bg-surface p-3 text-xs text-slate-600">
                <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                {MARGIN_DISCLAIMER}
              </p>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}

TechnicalDetails.propTypes = {
  result: PropTypes.object.isRequired,
  modelClasses: PropTypes.arrayOf(PropTypes.string),
}
