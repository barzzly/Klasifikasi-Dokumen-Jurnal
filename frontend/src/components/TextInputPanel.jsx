import PropTypes from 'prop-types'

import { MIN_TEXT_LENGTH } from '../utils/constants'
import { formatNumber } from '../utils/formatters'

/** Textarea panel for pasting document text. */
export default function TextInputPanel({ value, onChange, disabled }) {
  const length = value.length
  const tooShort = length > 0 && length < MIN_TEXT_LENGTH

  return (
    <div className="space-y-2">
      <label htmlFor="document-text" className="block font-medium text-slate-900">
        Tempel teks dokumen
      </label>
      <textarea
        id="document-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={12}
        aria-describedby="text-help"
        placeholder="Tempel isi dokumen ilmiah di sini..."
        className="w-full resize-y rounded-card border border-surface bg-surface/40 p-4 text-sm text-slate-800 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
      />
      <p
        id="text-help"
        className={`text-sm ${tooShort ? 'text-red-600' : 'text-slate-500'}`}
      >
        {formatNumber(length)} karakter. Minimum {formatNumber(MIN_TEXT_LENGTH)}{' '}
        karakter diperlukan untuk analisis.
      </p>
    </div>
  )
}

TextInputPanel.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}
