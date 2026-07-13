import PropTypes from 'prop-types'
import { AlertCircle } from 'lucide-react'

/** Accessible error message banner. */
export default function ErrorAlert({ message }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

ErrorAlert.propTypes = {
  message: PropTypes.string,
}
