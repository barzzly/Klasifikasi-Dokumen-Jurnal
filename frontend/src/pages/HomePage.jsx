import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FileSearch,
  Info,
  ListChecks,
  UploadCloud,
} from 'lucide-react'

import PageContainer from '../components/PageContainer'

const PROCESS_CARDS = [
  {
    icon: UploadCloud,
    title: 'Unggah Dokumen',
    description: 'Unggah dokumen karya ilmiah dalam format PDF.',
  },
  {
    icon: ListChecks,
    title: 'Validasi Struktur',
    description:
      'Sistem memeriksa keberadaan abstrak, metodologi, hasil, dan daftar pustaka.',
  },
  {
    icon: FileSearch,
    title: 'Klasifikasi Teks',
    description:
      'Dokumen yang lolos validasi dianalisis menggunakan TF-IDF dan LinearSVC.',
  },
]

/** Landing page. */
export default function HomePage() {
  return (
    <PageContainer>
      <section className="py-8 text-center sm:py-14">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
          <FileSearch size={32} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
          Klasifikasi Dokumen Jurnal
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Alat bantu untuk mengidentifikasi apakah sebuah dokumen ilmiah
          menyerupai artikel jurnal atau bukan, melalui validasi struktur dan
          klasifikasi teks dua tahap.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/klasifikasi" className="btn-primary">
            Mulai Klasifikasi
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/tentang-model" className="btn-secondary">
            Pelajari Metode
          </Link>
        </div>
      </section>

      <section className="py-6" aria-labelledby="alur-kerja">
        <h2 id="alur-kerja" className="text-center font-heading text-2xl font-bold">
          Alur Kerja Dua Tahap
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
          Tahap pertama memeriksa struktur wajib dokumen. Hanya dokumen yang
          lengkap yang dilanjutkan ke tahap klasifikasi teks menggunakan model.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PROCESS_CARDS.map((card, index) => (
            <div key={card.title} className="card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-primary">
                  <card.icon size={20} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  Langkah {index + 1}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-6">
        <div className="flex items-start gap-3 rounded-card border border-surface bg-surface/60 p-5">
          <Info size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-slate-700">
            Sistem ini merupakan alat bantu klasifikasi dan bukan bukti resmi
            bahwa dokumen telah diterbitkan sebagai jurnal.
          </p>
        </div>
      </section>
    </PageContainer>
  )
}
