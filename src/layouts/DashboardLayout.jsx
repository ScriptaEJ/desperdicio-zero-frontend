// src/layouts/DashboardLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import RegisterLossModal from '../components/RegisterLossModal/RegisterLossModal';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import { useToast } from '../contexts/ToastContext';
import { perdasService } from '../services/perdasService';

export default function DashboardLayout() {
  const toast = useToast();
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaveLoss = async (dados) => {
    try {
      await perdasService.criar(dados);
      toast.success('Perda registrada com sucesso!');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Não foi possível registrar a perda.'
      );
      throw err;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7F5]">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
                  onOpenRegisterLoss={() => setIsLossModalOpen(true)}
                  onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                  onSelectRestaurant={(restaurante) => {
                    toast.success(`Restaurante alterado para ${restaurante.nome}`);
                    setRefreshKey((prev) => prev + 1);
                  }}
                />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet key={refreshKey} />
        </main>
      </div>

      <RegisterLossModal
        isOpen={isLossModalOpen}
        onClose={() => setIsLossModalOpen(false)}
        onSave={handleSaveLoss}
      />
    </div>
  );
}