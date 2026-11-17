import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const DASHBOARD_PRESETS = {
  'Esta semana': {
    custoPerdido: 1520.4,
    comparativoCusto: '12,4% menor que a semana anterior',
    itensDescartados: 89.6,
    comparativoItens: '7,2 kg a menos no período',
    registrosPerda: 47,
    mediaRegistros: 'Média de 6,7 registros por dia',
    periodoRelatorio: '01 a 07 de junho',
    ranking: [
      { id: 1, nome: 'Mussarela', valor: 486.2, percentual: 32, barWidth: 78, color: 'bg-[#F59E0B]' },
      { id: 2, nome: 'Tomate', valor: 273.8, percentual: 18, barWidth: 44, color: 'bg-[#EF5350]' },
      { id: 3, nome: 'Filé de frango', valor: 212.9, percentual: 14, barWidth: 34, color: 'bg-[#38A169]' },
      { id: 4, nome: 'Arroz branco', valor: 152.0, percentual: 10, barWidth: 24, color: 'bg-[#7C9A7E]' },
      { id: 5, nome: 'Outros itens', valor: 395.5, percentual: 26, barWidth: 63, color: 'bg-[#D6D6D2]' },
    ],
    diasSemana: [
      { dia: 'Seg', valor: 175, heightPct: 50, destaque: false },
      { dia: 'Ter', valor: 235, heightPct: 68, destaque: false },
      { dia: 'Qua', valor: 155, heightPct: 44, destaque: false },
      { dia: 'Qui', valor: 290, heightPct: 83, destaque: false },
      { dia: 'Sex', valor: 348, heightPct: 100, destaque: true },
      { dia: 'Sáb', valor: 310, heightPct: 89, destaque: false },
      { dia: 'Dom', valor: 205, heightPct: 59, destaque: false },
    ],
    maiorDesperdicioTitulo: 'Sexta-feira à noite',
    maiorDesperdicioValor: 348,
    alertaItem: 'Mussarela',
    alertaPercentual: '32%',
    alertaDetalhes: 'Foram 18,4 kg descartados, principalmente por vencimento e sobra de preparo.',
    sugestaoTitulo: 'Ajuste a compra de mussarela',
    sugestaoTextoAntes: 'Reduza a compra semanal em ',
    sugestaoDestaque1: '8%',
    sugestaoTextoMeio: ' e ajuste a porção padrão de 120g para 110g. Economia estimada de ',
    sugestaoEconomia: 'R$ 380/mês',
  },
  'Semana passada': {
    custoPerdido: 1735.6,
    comparativoCusto: '4,1% maior que a semana retrasada',
    itensDescartados: 96.8,
    comparativoItens: '3,5 kg a mais no período',
    registrosPerda: 53,
    mediaRegistros: 'Média de 7,6 registros por dia',
    periodoRelatorio: '25 a 31 de maio',
    ranking: [
      { id: 1, nome: 'Mussarela', valor: 538.0, percentual: 31, barWidth: 76, color: 'bg-[#F59E0B]' },
      { id: 2, nome: 'Tomate', valor: 347.1, percentual: 20, barWidth: 49, color: 'bg-[#EF5350]' },
      { id: 3, nome: 'Filé de frango', valor: 260.3, percentual: 15, barWidth: 37, color: 'bg-[#38A169]' },
      { id: 4, nome: 'Arroz branco', valor: 173.6, percentual: 10, barWidth: 24, color: 'bg-[#7C9A7E]' },
      { id: 5, nome: 'Outros itens', valor: 416.6, percentual: 24, barWidth: 59, color: 'bg-[#D6D6D2]' },
    ],
    diasSemana: [
      { dia: 'Seg', valor: 190, heightPct: 48, destaque: false },
      { dia: 'Ter', valor: 250, heightPct: 63, destaque: false },
      { dia: 'Qua', valor: 210, heightPct: 53, destaque: false },
      { dia: 'Qui', valor: 305, heightPct: 77, destaque: false },
      { dia: 'Sex', valor: 395, heightPct: 100, destaque: true },
      { dia: 'Sáb', valor: 340, heightPct: 86, destaque: false },
      { dia: 'Dom', valor: 230, heightPct: 58, destaque: false },
    ],
    maiorDesperdicioTitulo: 'Sexta-feira à noite',
    maiorDesperdicioValor: 395,
    alertaItem: 'Mussarela',
    alertaPercentual: '31%',
    alertaDetalhes: 'Foram 20,4 kg descartados, com pico na operação do jantar de sexta.',
    sugestaoTitulo: 'Ajuste a compra de mussarela',
    sugestaoTextoAntes: 'Reduza a compra semanal em ',
    sugestaoDestaque1: '10%',
    sugestaoTextoMeio: ' e revise o armazenamento refrigerado. Economia estimada de ',
    sugestaoEconomia: 'R$ 420/mês',
  },
  'Este mês': {
    custoPerdido: 5890.0,
    comparativoCusto: '9,8% menor que o mês anterior',
    itensDescartados: 342.4,
    comparativoItens: '24,0 kg a menos no período',
    registrosPerda: 184,
    mediaRegistros: 'Média de 6,1 registros por dia',
    periodoRelatorio: '01 a 30 de junho',
    ranking: [
      { id: 1, nome: 'Mussarela', valor: 1825.9, percentual: 31, barWidth: 76, color: 'bg-[#F59E0B]' },
      { id: 2, nome: 'Tomate', valor: 1119.1, percentual: 19, barWidth: 47, color: 'bg-[#EF5350]' },
      { id: 3, nome: 'Filé de frango', valor: 883.5, percentual: 15, barWidth: 37, color: 'bg-[#38A169]' },
      { id: 4, nome: 'Arroz branco', valor: 589.0, percentual: 10, barWidth: 24, color: 'bg-[#7C9A7E]' },
      { id: 5, nome: 'Outros itens', valor: 1472.5, percentual: 25, barWidth: 61, color: 'bg-[#D6D6D2]' },
    ],
    diasSemana: [
      { dia: 'Seg', valor: 680, heightPct: 50, destaque: false },
      { dia: 'Ter', valor: 890, heightPct: 66, destaque: false },
      { dia: 'Qua', valor: 640, heightPct: 47, destaque: false },
      { dia: 'Qui', valor: 1120, heightPct: 83, destaque: false },
      { dia: 'Sex', valor: 1350, heightPct: 100, destaque: true },
      { dia: 'Sáb', valor: 1210, heightPct: 90, destaque: false },
      { dia: 'Dom', valor: 810, heightPct: 60, destaque: false },
    ],
    maiorDesperdicioTitulo: 'Sextas-feiras à noite',
    maiorDesperdicioValor: 1350,
    alertaItem: 'Mussarela',
    alertaPercentual: '31%',
    alertaDetalhes: 'Acumulado de 69,2 kg no mês, concentrado nos fins de semana.',
    sugestaoTitulo: 'Ajuste a compra de mussarela',
    sugestaoTextoAntes: 'Reduza a compra semanal em ',
    sugestaoDestaque1: '8%',
    sugestaoTextoMeio: ' e ajuste a porção padrão de 120g para 110g. Economia estimada de ',
    sugestaoEconomia: 'R$ 380/mês',
  },
};

const SHIFT_MULTIPLIERS = {
  'Todos os turnos': 1,
  Manhã: 0.25,
  Tarde: 0.32,
  Noite: 0.43,
};

const formatBRL = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function VisaoGeralPage({ userName = 'Marina' }) {
  const [periodo, setPeriodo] = useState('Esta semana');
  const [turno, setTurno] = useState('Todos os turnos');
  const [downloading, setDownloading] = useState(false);

  const data = useMemo(() => {
    const base = DASHBOARD_PRESETS[periodo] || DASHBOARD_PRESETS['Esta semana'];
    const mult = SHIFT_MULTIPLIERS[turno] ?? 1;

    if (mult === 1) return base;

    return {
      ...base,
      custoPerdido: base.custoPerdido * mult,
      itensDescartados: Number((base.itensDescartados * mult).toFixed(1)),
      registrosPerda: Math.max(1, Math.round(base.registrosPerda * mult)),
      ranking: base.ranking.map((item) => ({
        ...item,
        valor: item.valor * mult,
      })),
      diasSemana: base.diasSemana.map((d) => ({
        ...d,
        valor: Math.round(d.valor * mult),
      })),
      maiorDesperdicioValor: Math.round(base.maiorDesperdicioValor * mult),
    };
  }, [periodo, turno]);

  const handleDownloadReport = () => {
    setDownloading(true);

    const linhas = [
      'Resumo Semanal - Desperdício Zero',
      `Período: ${data.periodoRelatorio} (${turno})`,
      `Custo perdido: ${formatBRL(data.custoPerdido)}`,
      `Itens descartados: ${data.itensDescartados.toLocaleString('pt-BR')} kg`,
      `Registros de perda: ${data.registrosPerda}`,
      '',
      'Ranking por item:',
      ...data.ranking.map(
        (r, i) => `${i + 1}. ${r.nome} - ${formatBRL(r.valor)} (${r.percentual}%)`
      ),
    ];

    const blob = new Blob([linhas.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-desperdicio-zero.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Cabeçalho + Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-brand-800">Olá, {userName}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Visão geral
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe os desperdícios e tome decisões mais inteligentes.
          </p>
        </div>

        {/* Dropdowns de Período e Turno */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <div className="relative">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              aria-label="Selecionar período"
              className="w-full sm:w-auto appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-brand-800 cursor-pointer"
            >
              <option value="Esta semana">Esta semana</option>
              <option value="Semana passada">Semana passada</option>
              <option value="Este mês">Este mês</option>
            </select>
            <ChevronDown />
          </div>

          <div className="relative">
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              aria-label="Selecionar turno"
              className="w-full sm:w-auto appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:border-brand-800 cursor-pointer"
            >
              <option value="Todos os turnos">Todos os turnos</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      {/* Linha 1: 3 Cards de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Card 1: Custo perdido (com borda lateral verde) */}
        <div className="bg-white rounded-xl border border-slate-200/80 border-l-4 border-l-brand-800 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">Custo perdido</p>
            <span className="w-7 h-7 rounded-lg bg-[#E7F3EC] text-[#145338] flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
                <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          <p className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight mt-2">
            {formatBRL(data.custoPerdido)}
          </p>
          <p className="text-xs font-medium text-[#145338] mt-1.5">
            {data.comparativoCusto}
          </p>
        </div>

        {/* Card 2: Itens descartados */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">Itens descartados</p>
            <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold shrink-0">
              kg
            </span>
          </div>

          <p className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight mt-2">
            {data.itensDescartados.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg
          </p>
          <p className="text-xs font-medium text-[#145338] mt-1.5">
            {data.comparativoItens}
          </p>
        </div>

        {/* Card 3: Registros de perda */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">Registros de perda</p>
            <span className="w-7 h-7 rounded-lg bg-[#FEF3C7]/80 text-[#D97706] flex items-center justify-center shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
            </span>
          </div>

          <p className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight mt-2">
            {data.registrosPerda}
          </p>
          <p className="text-xs text-slate-400 mt-1.5">{data.mediaRegistros}</p>
        </div>
      </div>

      {/* Linha 2: Ranking por item + Gráfico Por dia da semana */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Ranking por item (7 colunas no desktop) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ranking por item</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Itens que mais geraram custo nesta semana
              </p>
            </div>

            <Link
              to="/analises"
              className="text-xs font-semibold text-brand-800 hover:underline shrink-0"
            >
              Ver análise
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {data.ranking.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center gap-2 sm:gap-3 text-xs sm:text-sm"
              >
                {/* Posição + Nome */}
                <div className="col-span-5 sm:col-span-4 flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-medium text-slate-400 w-3 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-800 truncate">{item.nome}</span>
                </div>

                {/* Barra de progresso */}
                <div className="col-span-4 sm:col-span-5">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                      style={{ width: `${item.barWidth}%` }}
                    />
                  </div>
                </div>

                {/* Valor + Percentual */}
                <div className="col-span-3 flex items-center justify-end gap-2 sm:gap-3 shrink-0">
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {formatBRL(item.valor)}
                  </span>
                  <span className="text-xs text-slate-400 w-8 text-right tabular-nums hidden sm:inline">
                    {item.percentual}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Por dia da semana (5 colunas no desktop) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Por dia da semana</h2>
            <p className="text-xs text-slate-400 mt-0.5">Custo de desperdício em reais</p>
          </div>

          {/* Gráfico de Barras Verticais */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-40 pt-6 pb-2 px-1">
            {data.diasSemana.map((item) => (
              <div
                key={item.dia}
                className="flex flex-col items-center justify-end h-full group"
              >
                {/* Valor no hover */}
                <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1 tabular-nums">
                  R${item.valor}
                </span>

                <div className="w-full max-w-[34px] flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      item.destaque
                        ? 'bg-[#E09F3E]'
                        : 'bg-[#76A88D] group-hover:bg-[#5E9477]'
                    }`}
                    style={{ height: `${item.heightPct}%` }}
                    title={`${item.dia}: ${formatBRL(item.valor)}`}
                  />
                </div>

                <span
                  className={`text-[11px] mt-2 ${
                    item.destaque ? 'font-bold text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {item.dia}
                </span>
              </div>
            ))}
          </div>

          {/* Destaque Maior Desperdício */}
          <div className="mt-4 bg-[#FDF6EC] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <span className="block text-[11px] text-slate-500">Maior desperdício</span>
              <span className="block text-sm font-bold text-slate-900 mt-0.5">
                {data.maiorDesperdicioTitulo}
              </span>
            </div>

            <span className="bg-white border border-amber-200/80 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 tabular-nums">
              R$ {data.maiorDesperdicioValor}
            </span>
          </div>
        </div>
      </div>

      {/* Linha 3: Alerta da Semana + Sugestão Inteligente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card Escuro: Alerta da Semana */}
        <div className="lg:col-span-7 bg-[#14452F] text-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-white/75">
                Alerta da semana
              </span>
            </div>

            <span className="bg-[#E9B949] text-[#143322] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0">
              Atenção
            </span>
          </div>

          <div className="mt-5">
            <h3 className="text-lg sm:text-[22px] font-bold leading-snug tracking-tight">
              {data.alertaItem} representou{' '}
              <span className="text-[#F4C150]">
                {data.alertaPercentual} do desperdício
              </span>{' '}
              desta semana.
            </h3>
            <p className="text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">
              {data.alertaDetalhes}
            </p>
          </div>
        </div>

        {/* Card Branco: Sugestão Inteligente */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#E7F3EC] text-[#145338] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85">
                  <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.75c.64.54 1 1.33 1 2.17V17h6v-.08c0-.84.36-1.63 1-2.17A7 7 0 0 0 12 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>

              <div>
                <span className="block text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Sugestão inteligente
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {data.sugestaoTitulo}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-4 leading-relaxed">
              {data.sugestaoTextoAntes}
              <strong className="font-semibold text-slate-800">{data.sugestaoDestaque1}</strong>
              {data.sugestaoTextoMeio}
              <strong className="font-semibold text-[#145338]">{data.sugestaoEconomia}</strong>.
            </p>
          </div>

          <div className="mt-4 pt-1">
            <Link
              to="/relatorios"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-800 hover:underline"
            >
              <span>Ver relatório completo</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Linha 4: Barra de Relatório Semanal Pronto */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <span className="w-10 h-10 rounded-xl bg-[#E7F3EC] text-[#145338] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="m9 15 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <div>
            <p className="text-sm font-bold text-slate-900">Relatório semanal pronto</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Resumo para o proprietário • {data.periodoRelatorio}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadReport}
          className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors w-full sm:w-auto cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
          </svg>
          <span>{downloading ? 'Relatório baixado!' : 'Baixar relatório'}</span>
        </button>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      className="w-4 h-4 text-slate-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}