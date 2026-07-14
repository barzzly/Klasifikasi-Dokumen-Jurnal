// Client-side file validation. Server-side validation is still authoritative.
import {
  ACCEPTED_EXTENSION,
  ACCEPTED_MIME,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from './constants'

/**
 * Validate an uploaded file for type and size.
 * @param {File|null} file
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'Silakan pilih berkas PDF terlebih dahulu.' }
  }

  const name = (file.name || '').toLowerCase()
  const isPdfExt = name.endsWith(ACCEPTED_EXTENSION)
  const isPdfMime = !file.type || file.type === ACCEPTED_MIME

  if (!isPdfExt || !isPdfMime) {
    return { valid: false, error: 'Berkas yang diunggah harus berformat PDF.' }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Ukuran berkas melebihi batas maksimum ${MAX_FILE_SIZE_MB} MB.`,
    }
  }

  return { valid: true, error: null }
}
