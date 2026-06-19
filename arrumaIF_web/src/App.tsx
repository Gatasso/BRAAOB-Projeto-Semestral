import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute'
import {
  AberturaChamadoPage,
  AdminEditChamadoPage,
  AdminHomePage,
  AdminLoginPage,
  HomePage,
  InformativoPage,
  LoginPage,
} from '@/pages'
import { isAuthenticated } from '@/lib/auth'

function RootRedirect() {
  return <Navigate to={isAuthenticated() ? '/' : '/login'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/informativo"
          element={
            <ProtectedRoute>
              <InformativoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chamado/novo"
          element={
            <ProtectedRoute>
              <AberturaChamadoPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminHomePage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/chamado/:id/editar"
          element={
            <AdminProtectedRoute>
              <AdminEditChamadoPage />
            </AdminProtectedRoute>
          }
        />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
