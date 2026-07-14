import PropTypes from 'prop-types'
import { CheckCircle2, FileX } from 'lucide-react'

import { FINAL_LABELS } from '../utils/constants'

/** Large final-result label. Status conveyed by icon + text, not colour alone. */
export default function ResultBadge({ label }) {
  const isJurnal = label === 'jurnal'
  const text = FINAL_LABELS[label] || label
  const Icon = isJurnal ? CheckCircle2 : FileX

  return (
    <div
      className={[
        'flex items-center gap-4 rounded-card border p-6',
        isJurnal
          ? 'border-primary/30 bg-primary/5'
          : 'border-slate-300 bg-surface',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-14 w-14 items-center justify-center rounded-full',
          isJurnal ? 'bg-primary text-white' : 'bg-slate-600 text-white',
        ].join(' ')}
      >
        <Icon size={28} aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Hasil Klasifikasi
        </p>
        <p className="font-heading text-3xl font-bold text-slate-900">{text}</p>
      </div>
    </div>
  )
}

ResultBadge.propTypes = {
  label: PropTypes.string.isRequired,
}
