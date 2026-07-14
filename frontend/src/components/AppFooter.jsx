/** Simple site footer with the disclaimer. */
export default function AppFooter() {
  return (
    <footer className="mt-auto border-t border-surface bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
        <p>
          Alat bantu klasifikasi dokumen ilmiah. Hasil bukan bukti resmi
          publikasi jurnal.
        </p>
        <p className="mt-1">Prototipe pendukung keputusan administratif.</p>
      </div>
    </footer>
  )
}
