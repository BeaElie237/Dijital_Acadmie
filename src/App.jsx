import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Découpage par route : le site vitrine (public) et la plateforme (admin/étudiant)
// ne sont chargés que lorsqu'ils sont réellement visités.
const Login = lazy(() => import('./pages/Login'))
const VitrineHome = lazy(() => import('./vitrine/VitrineHome'))

const AdminLayout = lazy(() => import('./components/layout/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const StudentDetail = lazy(() => import('./pages/admin/StudentDetail'))
const AttendanceAdmin = lazy(() => import('./pages/admin/AttendanceAdmin'))

const StudentLayout = lazy(() => import('./components/layout/StudentLayout'))
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'))
const ScanQr = lazy(() => import('./pages/student/ScanQr'))
const StudentAttendance = lazy(() => import('./pages/student/StudentAttendance'))
const Settings = lazy(() => import('./pages/student/Settings'))

function PageFallback() {
  return (
    <div className="flex h-screen items-center justify-center text-slate-400 text-sm">
      Chargement...
    </div>
  )
}

function Home() {
  const { session, profile, loading } = useAuth()
  if (loading) return null
  // Visiteur non connecté : site vitrine. Utilisateur déjà connecté : direction son dashboard.
  if (!session) return <VitrineHome />
  return <Navigate to={profile?.role === 'admin' ? '/admin' : '/etudiant'} replace />
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="etudiants/:id" element={<StudentDetail />} />
          <Route path="presence" element={<AttendanceAdmin />} />
        </Route>

        <Route
          path="/etudiant"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="scan" element={<ScanQr />} />
          <Route path="presence" element={<StudentAttendance />} />
          <Route path="parametres" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
