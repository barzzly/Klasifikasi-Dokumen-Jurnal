import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FileText, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/klasifikasi', label: 'Klasifikasi' },
  { to: '/tentang-model', label: 'Tentang Model' },
]

/** Persistent, responsive top navigation. */
export default function AppHeader() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    [
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary text-white'
        : 'text-slate-700 hover:bg-surface hover:text-primary',
    ].join(' ')

  return (
    <header className="sticky top-0 z-40 border-b border-surface bg-background">
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Navigasi utama"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-900"
          aria-label="Klasifikasi Dokumen Jurnal - Beranda"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <FileText size={20} aria-hidden="true" />
          </span>
          <span className="font-heading text-base font-bold sm:text-lg">
            Klasifikasi Dokumen Jurnal
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="btn-secondary md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-surface md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
