import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Chargement...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (role && profile?.role !== role) {
    return <Navigate to={profile?.role === 'admin' ? '/admin' : '/etudiant'} replace />
  }

  return children
}
