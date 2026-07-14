import { useState } from 'react'
import PropTypes from 'prop-types'
import { CheckCircle2, ChevronDown, XCircle } from 'lucide-react'

import { REQUIRED_STRUCTURE_LABELS } from '../utils/constants'

/** Status card for a single required structure. */
export default function StructureCard({ structureKey, item }) {
  const [open, setOpen] = useState(false)
  const found = item?.found
  const title = REQUIRED_STRUCTURE_LABELS[structureKey] || structureKey

  return (
    <div
      className={[
        'card p-4',
        found ? 'border-primary/30' : 'border-red-300',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-heading text-base font-semibold text-slate-900">
          {title}
        </h3>
        {found ? (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            <CheckCircle2 size={16} aria-hidden="true" />
            Ditemukan
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
            <XCircle size={16} aria-hidden="true" />
            Tidak ditemukan
          </span>
        )}
      </div>

      {found && (
        <p className="mt-2 text-sm text-slate-600">
          Judul terdeteksi:{' '}
          <span className="font-medium text-slate-800">
            {item.matched_heading}
          </span>
        </p>
      )}

      {found && item.excerpt && (
        <div className="mt-3">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <ChevronDown
              size={16}
              className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
              aria-hidden="true"
            />
            {open ? 'Sembunyikan kutipan' : 'Lihat kutipan'}
          </button>
          {open && (
            <p className="mt-2 rounded-md bg-surface p-3 text-sm text-slate-700">
              {item.excerpt}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

StructureCard.propTypes = {
  structureKey: PropTypes.string.isRequired,
  item: PropTypes.shape({
    found: PropTypes.bool,
    matched_heading: PropTypes.string,
    excerpt: PropTypes.string,
  }),
}
