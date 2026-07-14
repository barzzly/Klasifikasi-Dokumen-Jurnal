// Shared constants and Indonesian UI labels.

export const MAX_FILE_SIZE_MB = 15
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
export const MIN_TEXT_LENGTH = 300
export const ACCEPTED_MIME = 'application/pdf'
export const ACCEPTED_EXTENSION = '.pdf'

export const MODEL_NAME = 'TF-IDF + LinearSVC'

export const REQUIRED_STRUCTURE_LABELS = {
  abstrak: 'Abstrak',
  metodologi: 'Metodologi',
  hasil: 'Hasil',
  daftar_pustaka: 'Daftar Pustaka',
}

export const STRUCTURE_ORDER = ['abstrak', 'metodologi', 'hasil', 'daftar_pustaka']

export const FINAL_LABELS = {
  jurnal: 'Jurnal',
  non_jurnal: 'Non-Jurnal',
}

export const DECISION_STAGE_LABELS = {
  validasi_struktur: 'Validasi Struktur',
  text_classification: 'Klasifikasi Teks',
}

export const LOADING_STEPS = [
  'Mengunggah dokumen',
  'Mengekstrak teks',
  'Memeriksa struktur',
  'Menjalankan klasifikasi teks',
]

export const MARGIN_DISCLAIMER =
  'Margin keputusan bukan probabilitas atau persentase keyakinan.'

export const RESULT_DISCLAIMER =
  'Hasil ini merupakan prediksi sistem berdasarkan struktur dan pola teks dokumen. ' +
  'Hasil tidak membuktikan status publikasi resmi.'

export const SESSION_RESULT_KEY = 'analysis_result'
