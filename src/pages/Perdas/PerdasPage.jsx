import { useState } from 'react';
import RegisterLossModal from '../../components/RegisterLossModal/RegisterLossModal';
import { PerdasFiltros } from '../../components/Perdas/PerdasFiltros';
import { PerdasTabela } from '../../components/Perdas/PerdasTabela';
import { ResumoPerdas } from '../../components/Perdas/ResumoPerdas';
import { usePerdas } from '../../hooks/usePerdas';

export default function PerdasPage() {
  const { perdas, resumo, carregando, erro, busca, setBusca, motivo, setMotivo, criar, recarregar } = usePerdas();
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <main className="min-h-screen bg-[#f4f6f4] px-4 py-6 text-[#12261d] md:px-12 md:py-10">
      <header className="mb-7 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-sm font-semibold text-[#2f7a5a]">Operação</span>
          <h1 className="mb-1 mt-1.5 text-4xl font-bold tracking-tight">Registros de perda</h1>
          <p className="text-[#6b7c73]">Consulte, filtre e registre todos os descartes da cozinha.</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#14573f] px-5 py-3 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14573f] focus-visible:ring-offset-2"
        >
          <span aria-hidden>+</span> Nova perda
        </button>
      </header>

      <ResumoPerdas resumo={resumo} />

      <section className="overflow-hidden rounded-[20px] border border-[#e3e9e5] bg-white">
        <PerdasFiltros busca={busca} onBusca={setBusca} motivo={motivo} onMotivo={setMotivo} />
        <PerdasTabela perdas={perdas} carregando={carregando} erro={erro} onTentarNovamente={recarregar} />
      </section>

      <RegisterLossModal isOpen={modalAberto} onClose={() => setModalAberto(false)} onSave={criar} />
    </main>
  );
}