import { useEffect, useRef, useState } from 'react';
import FeaturedReport from '../../components/FeaturedReport/FeaturedReport';
import ReportCard from '../../components/ReportCard/ReportCard';
import AutoSendCard from '../../components/AutoSendCard/AutoSendCard';
import { PlusIcon } from '../../components/ReportIcons/ReportIcons';
import {
  downloadReport,
  getReportsData,
  setAutoSend,
} from '../../services/reportService';

function getHojeISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function getSeteDiasAtrasISO() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export default function RelatoriosPage() {
  const [data, setData] = useState(null);
  const [toast, setToast] = useState('');
  const [baixandoId, setBaixandoId] = useState(null);

  // Estado do modal "Gerar relatório" com período customizado
  const [modalAberto, setModalAberto] = useState(false);
  const [relatorioSelecionadoId, setRelatorioSelecionadoId] = useState('executivo-semanal');
  const [dataInicio, setDataInicio] = useState(getSeteDiasAtrasISO);
  const [dataFim, setDataFim] = useState(getHojeISO);
  const [gerandoCustom, setGerandoCustom] = useState(false);

  const timer = useRef();

  useEffect(() => {
    getReportsData().then(setData);
    return () => clearTimeout(timer.current);
  }, []);

  const notify = (message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 3200);
  };

  const handleDownload = async (report, filtros = {}) => {
    if (baixandoId) return;

    try {
      setBaixandoId(report.id);
      notify(`Gerando ${report.title} (${report.format})…`);
      const result = await downloadReport(report, filtros);
      notify(`Download concluído: ${result.filename}`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erro ao baixar relatório.');
    } finally {
      setBaixandoId(null);
    }
  };

  const handleGerarPersonalizado = async (e) => {
    e.preventDefault();
    if (!data) return;

    const todos = [data.featured, ...data.reports];
    const escolhido =
      todos.find((r) => r.id === relatorioSelecionadoId) || data.featured;

    try {
      setGerandoCustom(true);
      await handleDownload(escolhido, {
        inicio: dataInicio || undefined,
        fim: dataFim || undefined,
      });
      setModalAberto(false);
    } finally {
      setGerandoCustom(false);
    }
  };

  const handleToggleAuto = async (enabled) => {
    const autoSend = await setAutoSend(enabled);
    setData((prev) => ({ ...prev, autoSend }));
    notify(enabled ? 'Envio automático ativado' : 'Envio automático desativado');
  };

  if (!data) return <p className="p-[38px] text-[#76807b]">Carregando…</p>;

  const todosRelatorios = [data.featured, ...data.reports];

  return (
    <div className="px-4 pb-12 pt-6 text-[#16211c] md:px-[38px] md:pb-[60px] md:pt-9">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-medium text-[#0f6b4f]">Documentos</span>
          <h1 className="mb-1.5 mt-2 text-[34px] font-bold tracking-tight">Relatórios</h1>
          <p className="text-[#76807b]">
            Gere e compartilhe informações para apoiar suas decisões.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalAberto(true)}
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

      {/* Modal de Geração com Período Personalizado */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
          onClick={() => !gerandoCustom && setModalAberto(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleGerarPersonalizado}
            className="w-full max-w-[460px] rounded-2xl bg-white p-6 shadow-xl border border-slate-200/80 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0f6b4f]">
                  Exportação personalizada
                </span>
                <h2 className="text-xl font-bold text-[#16211c] mt-0.5">
                  Gerar relatório
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModalAberto(false)}
                disabled={gerandoCustom}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tipo de relatório
              </label>
              <select
                value={relatorioSelecionadoId}
                onChange={(e) => setRelatorioSelecionadoId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1b4d3e]"
              >
                {todosRelatorios.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.format})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Data inicial
                </label>
                <input
                  type="date"
                  required
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Data final
                </label>
                <input
                  type="date"
                  required
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                disabled={gerandoCustom}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={gerandoCustom}
                className="rounded-xl bg-[#1b4d3e] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60 cursor-pointer"
              >
                {gerandoCustom ? 'Gerando...' : 'Baixar arquivo'}
              </button>
            </div>
          </form>
        </div>
      )}

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