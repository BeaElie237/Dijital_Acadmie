import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'

import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentDetail from './pages/admin/StudentDetail'
import AttendanceAdmin from './pages/admin/AttendanceAdmin'

import StudentLayout from './components/layout/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import ScanQr from './pages/student/ScanQr'
import StudentAttendance from './pages/student/StudentAttendance'
import Settings from './pages/student/Settings'

function Home() {
  const { profile, loading } = useAuth()
  if (loading) return null
  return <Navigate to={profile?.role === 'admin' ? '/admin' : '/etudiant'} replace />
}

export default function App() {
  return (
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
  )
}
