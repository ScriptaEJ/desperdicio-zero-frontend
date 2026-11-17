import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import VisaoGeralPage from './pages/VisaoGeral/VisaoGeral';
import InsumosPage from './pages/Insumos/Insumos';
import ConfiguracoesPage from './pages/Configuracoes/Configuracoes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas (sem Sidebar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        {/* Rotas internas (com Sidebar fixa via DashboardLayout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/insumos" element={<InsumosPage />} />
          {/* Quando o time criar as outras, basta adicionar aqui: */}
          <Route path="/visao-geral" element={<VisaoGeralPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}