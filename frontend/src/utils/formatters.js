// Formatting helpers for display values.

/**
 * Format a byte count into a human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0 || bytes == null) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/**
 * Format a decision margin for the technical-details panel.
 * @param {number|null|undefined} margin
 * @returns {string}
 */
export function formatMargin(margin) {
  if (margin === null || margin === undefined) return '—'
  return Number(margin).toFixed(4)
}

/**
 * Format an integer with thousands separators (Indonesian locale).
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  if (value == null) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
}
