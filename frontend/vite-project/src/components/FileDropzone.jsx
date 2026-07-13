import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { FileText, UploadCloud, X } from 'lucide-react'

import { MAX_FILE_SIZE_MB } from '../utils/constants'
import { formatFileSize } from '../utils/formatters'

/**
 * Accessible drag-and-drop PDF uploader with keyboard and click fallbacks.
 */
export default function FileDropzone({ file, onSelect, onRemove, disabled }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openPicker()
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    if (disabled) return
    const dropped = event.dataTransfer.files?.[0]
    if (dropped) onSelect(dropped)
  }

  const handleChange = (event) => {
    const selected = event.target.files?.[0]
    if (selected) onSelect(selected)
    // Reset so selecting the same file again re-triggers change.
    event.target.value = ''
  }

  if (file) {
    return (
      <div className="card flex items-center justify-between gap-4 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
            <FileText size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900" title={file.name}>
              {file.name}
            </p>
            <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Hapus berkas ${file.name}`}
        >
          <X size={16} aria-hidden="true" />
          <span>Hapus</span>
        </button>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label="Area unggah berkas PDF. Tekan Enter untuk memilih berkas."
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDragOver={(e) => {
        e.preventDefault()
        setDragActive(true)
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={[
        'flex flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed bg-surface/60 px-6 py-12 text-center transition-colors',
        dragActive ? 'border-primary bg-surface' : 'border-slate-300',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-primary',
      ].join(' ')}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-card">
        <UploadCloud size={24} aria-hidden="true" />
      </span>
      <div>
        <p className="font-medium text-slate-900">
          Seret berkas PDF ke sini atau klik untuk memilih
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Hanya berkas PDF. Ukuran maksimum {MAX_FILE_SIZE_MB} MB.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}

FileDropzone.propTypes = {
  file: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}
