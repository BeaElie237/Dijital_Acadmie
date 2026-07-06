import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const links = [
  { to: '/admin', label: 'Vue d’ensemble', end: true },
  { to: '/admin/presence', label: 'Présence (QR code)' }
]

export default function AdminLayout() {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <aside className="sm:w-64 bg-brand-800 text-white flex sm:flex-col shrink-0">
        <div className="p-4 sm:p-6">
          <h1 className="text-lg font-bold">Suivi des Stages</h1>
          <p className="text-xs text-brand-200 mt-1">Espace administrateur</p>
        </div>
        <nav className="flex sm:flex-col flex-1 px-2 sm:px-4 gap-1 overflow-x-auto sm:overflow-visible">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap ${
                  isActive ? 'bg-white text-brand-800' : 'text-brand-100 hover:bg-brand-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 sm:p-6 mt-auto">
          <p className="text-xs text-brand-200 truncate">{profile?.full_name}</p>
          <button onClick={signOut} className="mt-2 text-sm text-brand-100 hover:text-white underline">
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
