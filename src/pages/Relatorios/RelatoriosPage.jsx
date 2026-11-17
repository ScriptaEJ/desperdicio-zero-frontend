import { useEffect, useRef, useState } from 'react';
import FeaturedReport from '../../components/FeaturedReport/FeaturedReport';
import ReportCard from '../../components/ReportCard/ReportCard';
import AutoSendCard from '../../components/AutoSendCard/AutoSendCard';
import { PlusIcon } from '../../components/ReportIcons/ReportIcons';

// SERVICE: quando criar o service, descomente o import abaixo
// e apague o bloco "MOCKS" inteiro mais embaixo.
// import { getReportsData, setAutoSend, downloadReport } from '../../services/reportsService';

// ===================== MOCKS (apagar depois) =====================
const MOCK_DATA = {
  featured: {
    id: 'executivo-semanal',
    title: 'Relatório executivo semanal',
    description:
      'Visão completa de custos, itens críticos e três recomendações práticas para reduzir o desperdício.',
    format: 'PDF',
  },
  reports: [
    {
      id: 'resumo-semanal',
      title: 'Resumo semanal',
      description: 'Custos, itens críticos e recomendações',
      format: 'PDF',
      period: '01 a 07 de junho',
    },
    {
      id: 'desperdicio-insumo',
      title: 'Desperdício por insumo',
      description: 'Ranking completo por quantidade e custo',
      format: 'XLSX',
      period: 'Junho de 2025',
    },
    {
      id: 'analise-turnos',
      title: 'Análise de turnos',
      description: 'Comparativo entre manhã, tarde e noite',
      format: 'PDF',
      period: 'Maio de 2025',
    },
    {
      id: 'historico-perdas',
      title: 'Histórico de perdas',
      description: 'Todos os registros detalhados do período',
      format: 'CSV',
      period: '01 a 31 de maio',
    },
  ],
  autoSend: {
    enabled: true,
    schedule: 'Todo domingo às 20h',
    email: 'dono@casadavila.com.br',
  },
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// SERVICE: reportsService.getReportsData()
// Futuro: GET /relatorios -> { featured, reports, autoSend }
async function getReportsData() {
  await wait(250);
  return MOCK_DATA;
}

// SERVICE: reportsService.setAutoSend(enabled)
// Futuro: PATCH /relatorios/envio-automatico  body: { enabled }
async function setAutoSend(enabled) {
  await wait(150);
  return { ...MOCK_DATA.autoSend, enabled };
}

// SERVICE: reportsService.downloadReport(report)
// Futuro: GET /relatorios/:id/download (responseType: 'blob')
// Aqui só o CSV baixa um arquivo de verdade; PDF e XLSX são simulados.
async function downloadReport(report) {
  await wait(300);
  if (report.format !== 'CSV') return { simulated: true };

  const csv = [
    'data,insumo,quantidade,unidade,custo_total,motivo,turno',
    '2025-05-02,Tomate,3.5,kg,31.15,Vencimento,Manhã',
    '2025-05-03,Frango,2,kg,37.00,Excesso de preparo,Noite',
    '2025-05-05,Alface,1.2,kg,14.40,Armazenamento,Tarde',
  ].join('\n');

  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  return { simulated: false };
}
// =================== FIM DOS MOCKS ===================

export default function RelatoriosPage() {
  const [data, setData] = useState(null);
  const [toast, setToast] = useState('');
  const timer = useRef();

  useEffect(() => {
    // SERVICE: carregamento inicial (getReportsData)
    getReportsData().then(setData);
    return () => clearTimeout(timer.current);
  }, []);

  const notify = (message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2500);
  };

  const handleDownload = async (report) => {
    notify(`Baixando ${report.title} (${report.format})…`);
    // SERVICE: downloadReport(report)
    const result = await downloadReport(report);
    if (result.simulated) notify(`Download simulado: ${report.title}`);
  };

  const handleToggleAuto = async (enabled) => {
    // SERVICE: setAutoSend(enabled)
    const autoSend = await setAutoSend(enabled);
    setData((prev) => ({ ...prev, autoSend }));
    notify(enabled ? 'Envio automático ativado' : 'Envio automático desativado');
  };

  if (!data) return <p className="p-[38px] text-[#76807b]">Carregando…</p>;

  return (
    <div className="px-4 pb-12 pt-6 text-[#16211c] md:px-[38px] md:pb-[60px] md:pt-9">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-medium text-[#0f6b4f]">Documentos</span>
          <h1 className="mb-1.5 mt-2 text-[34px] font-bold tracking-tight">Relatórios</h1>
          <p className="text-[#76807b]">Gere e compartilhe informações para apoiar suas decisões.</p>
        </div>

        {/* SERVICE (futuro): aqui chamaria o endpoint de geração de relatório */}
        <button
          type="button"
          onClick={() => notify('Gerando novo relatório… (simulado)')}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1b4d3e] px-[18px] py-3 text-sm font-semibold text-white hover:brightness-110"
        >
          <PlusIcon />
          Gerar relatório
        </button>
      </div>

      <FeaturedReport report={data.featured} onDownload={handleDownload} />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.reports.map((report) => (
          <ReportCard key={report.id} report={report} onDownload={handleDownload} />
        ))}
      </div>

      <AutoSendCard {...data.autoSend} onToggle={handleToggleAuto} />

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-7 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-xl bg-[#16211c] px-5 py-3 font-semibold text-white transition-all duration-200 ${
          toast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {toast}
      </div>
    </div>
  );
}