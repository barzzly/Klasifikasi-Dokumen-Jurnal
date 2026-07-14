import PropTypes from 'prop-types'
import { Check, Loader2 } from 'lucide-react'

import { LOADING_STEPS } from '../utils/constants'

/**
 * Animated multi-step loading indicator.
 * The fourth step (text classification) is only activated when the structure
 * validation stage has completed for a complete document.
 * @param {{ activeStep: number, showClassification: boolean }} props
 */
export default function LoadingSteps({ activeStep, showClassification }) {
  return (
    <div
      className="card p-6"
      role="status"
      aria-live="polite"
      aria-label="Sedang memproses dokumen"
    >
      <ol className="space-y-4">
        {LOADING_STEPS.map((label, index) => {
          const isClassificationStep = index === 3
          const dimmed = isClassificationStep && !showClassification
          const done = index < activeStep
          const active = index === activeStep && !dimmed

          return (
            <li key={label} className="flex items-center gap-3">
              <span
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full border text-sm',
                  done
                    ? 'border-primary bg-primary text-white'
                    : active
                      ? 'border-primary text-primary'
                      : 'border-surface text-slate-400',
                ].join(' ')}
                aria-hidden="true"
              >
                {done ? (
                  <Check size={16} />
                ) : active ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={[
                  'text-sm',
                  dimmed ? 'text-slate-400' : 'text-slate-800',
                  active ? 'font-semibold' : '',
                ].join(' ')}
              >
                {label}
                {dimmed && ' (jika struktur lengkap)'}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

LoadingSteps.propTypes = {
  activeStep: PropTypes.number.isRequired,
  showClassification: PropTypes.bool,
}
