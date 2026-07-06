import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const links = [
  { to: '/etudiant', label: 'Ma progression', end: true },
  { to: '/etudiant/scan', label: 'Scanner présence' },
  { to: '/etudiant/presence', label: 'Mon historique' },
  { to: '/etudiant/parametres', label: 'Paramètres' }
]

export default function StudentLayout() {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-700 text-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold">Suivi des Stages</h1>
            <p className="text-xs text-brand-200">{profile?.full_name}</p>
          </div>
          <button onClick={signOut} className="text-sm underline text-brand-100 hover:text-white">
            Déconnexion
          </button>
        </div>
        <nav className="max-w-3xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
                  isActive ? 'bg-white text-brand-800' : 'text-brand-100 hover:bg-brand-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  )
}
