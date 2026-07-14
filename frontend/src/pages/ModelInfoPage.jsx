import PropTypes from 'prop-types'
import { ArrowDown } from 'lucide-react'

import PageContainer from '../components/PageContainer'
import { REQUIRED_STRUCTURE_LABELS, STRUCTURE_ORDER } from '../utils/constants'

const WORKFLOW = [
  'PDF',
  'Ekstraksi Teks',
  'Validasi Struktur',
  'Jika tidak lengkap: Non-Jurnal',
  'Jika lengkap: TF-IDF + LinearSVC',
  'Jurnal atau Non-Jurnal',
]

const LIMITATIONS = [
  'Sistem tidak membuktikan publikasi jurnal resmi.',
  'Sistem belum mendukung OCR.',
  'PDF hasil pemindaian dapat gagal diekstrak teksnya.',
  'Kualitas prediksi bergantung pada data pelatihan.',
  'Dokumen ilmiah dengan gaya penulisan mirip sulit dibedakan.',
  'Margin keputusan bukan probabilitas.',
  'Model dapat membuat prediksi yang keliru.',
]

function Section({ id, title, children }) {
  return (
    <section aria-labelledby={id} className="card p-6">
      <h2 id={id} className="font-heading text-xl font-bold text-slate-900">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm text-slate-700">{children}</div>
    </section>
  )
}

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
}

/** Model and methodology information page. */
export default function ModelInfoPage() {
  return (
    <PageContainer>
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
        Tentang Model
      </h1>
      <p className="mt-2 text-slate-600">
        Penjelasan metodologi klasifikasi dua tahap dan batasannya.
      </p>

      <div className="mt-6 space-y-4">
        <Section id="hybrid" title="Klasifikasi Hibrida Dua Tahap">
          <p>
            Sistem menggabungkan validasi struktur berbasis aturan dengan
            klasifikasi teks berbasis pembelajaran mesin. Tahap pertama menyaring
            dokumen secara cepat, tahap kedua menganalisis pola teks.
          </p>
        </Section>

        <Section id="rule" title="Validasi Struktur Berbasis Aturan">
          <p>
            Sistem memeriksa keberadaan empat bagian wajib pada dokumen ilmiah.
            Jika satu saja tidak ditemukan, dokumen langsung diklasifikasikan
            sebagai Non-Jurnal tanpa memanggil model.
          </p>
          <ul className="ml-5 list-disc space-y-1">
            {STRUCTURE_ORDER.map((key) => (
              <li key={key}>{REQUIRED_STRUCTURE_LABELS[key]}</li>
            ))}
          </ul>
        </Section>

        <Section id="tfidf" title="TF-IDF">
          <p>
            TF-IDF (Term Frequency–Inverse Document Frequency) mengubah teks
            menjadi vektor numerik dengan menimbang kata berdasarkan seberapa
            khas kata tersebut pada sebuah dokumen dibanding keseluruhan korpus.
          </p>
        </Section>

        <Section id="linearsvc" title="LinearSVC">
          <p>
            LinearSVC adalah Support Vector Machine linear yang memisahkan kelas
            menggunakan bidang pembatas. Model menghasilkan margin keputusan,
            bukan probabilitas. Label akhir ditentukan oleh{' '}
            <code className="rounded bg-surface px-1">predict()</code>.
          </p>
        </Section>

        <Section id="workflow" title="Alur Klasifikasi">
          <ol className="space-y-2">
            {WORKFLOW.map((step, index) => (
              <li key={step} className="flex flex-col items-start gap-2">
                <span className="rounded-md bg-surface px-3 py-1 font-medium text-slate-800">
                  {step}
                </span>
                {index < WORKFLOW.length - 1 && (
                  <ArrowDown size={16} className="text-primary" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </Section>

        <Section id="limitations" title="Batasan Model">
          <ul className="ml-5 list-disc space-y-1">
            {LIMITATIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section id="verification" title="Prediksi vs Verifikasi Publikasi Resmi">
          <p>
            Hasil sistem adalah prediksi berdasarkan struktur dan pola teks.
            Verifikasi publikasi jurnal resmi tetap memerlukan metadata seperti
            DOI, ISSN, penerbit, nama jurnal, volume, dan nomor terbitan.
          </p>
        </Section>
      </div>
    </PageContainer>
  )
}
