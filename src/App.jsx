import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { ToastProvider } from './contexts/ToastContext';
import DashboardLayout from './layouts/DashboardLayout';
import ConfiguracoesPage from './pages/Configuracoes/Configuracoes';
import InsumosPage from './pages/Insumos/Insumos';
import LoginPage from './pages/Login/LoginPage';
import PerdasPage from './pages/Perdas/PerdasPage';
import RegisterPage from './pages/Register/RegisterPage';
import RelatoriosPage from './pages/Relatorios/RelatoriosPage';
import VisaoGeralPage from './pages/VisaoGeral/VisaoGeral';
import { isAuthenticated } from './services/authService';

function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/visao-geral" replace /> : children;
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas (sem Sidebar) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/cadastro"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Rotas internas protegidas (exigem token JWT válido) */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/visao-geral" replace />} />
              <Route path="/visao-geral" element={<VisaoGeralPage />} />
              <Route path="/perdas" element={<PerdasPage />} />
              <Route path="/insumos" element={<InsumosPage />} />
              <Route path="/relatorios" element={<RelatoriosPage />} />
              <Route path="/configuracoes" element={<ConfiguracoesPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/visao-geral" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}