// Reusable Axios API client. Base URL is read from the Vite environment.
import axios from 'axios'

const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL,
  timeout: 60000,
})

/**
 * Convert an Axios error into a safe, user-facing message.
 * @param {unknown} error
 * @returns {string}
 */
export function extractErrorMessage(error) {
  const data = error?.response?.data
  if (data?.error?.message) {
    return data.error.message
  }
  if (error?.code === 'ECONNABORTED') {
    return 'Permintaan melebihi batas waktu. Silakan coba lagi.'
  }
  if (error?.message === 'Network Error') {
    return 'Tidak dapat terhubung ke server. Pastikan backend berjalan.'
  }
  return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
}

/**
 * Upload a PDF document for analysis.
 * @param {File} file
 * @returns {Promise<object>}
 */
export async function analyzeDocument(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/documents/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/**
 * Analyze raw text without a file upload.
 * @param {string} text
 * @returns {Promise<object>}
 */
export async function analyzeText(text) {
  const { data } = await api.post('/texts/analyze', { text })
  return data
}

/**
 * Fetch backend health, including model availability.
 * @returns {Promise<object>}
 */
export async function getHealth() {
  const { data } = await api.get('/health')
  return data
}

/**
 * Fetch model metadata.
 * @returns {Promise<object>}
 */
export async function getModelInfo() {
  const { data } = await api.get('/model/info')
  return data
}

export default api
